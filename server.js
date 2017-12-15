require('dotenv').config()
var express = require('express');
var app = express();
var port = process.env.PORT || 1337;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var passport=require('passport');
var flash = require('connect-flash');
const MongoStore = require('connect-mongo')(session);


var configDB = require('./config/database.js');

mongoose.connect(configDB.url, { useMongoClient: true }); //other options like username/pass
//of Mongodb database currently using are also written here
// Use native promises
mongoose.Promise = global.Promise;
require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(cookieParser()); // sets req.cookie variable
app.use(bodyParser.urlencoded({extended: true})); // this means we can send even objects
//from front-end
//If extended is false, you can not post "nested objects"

app.use(session({ secret: process.env.SESSION_SECRET,
                  saveUninitialized: true,
                  resave: true,
                  store: new MongoStore({ mongooseConnection: mongoose.connection,
                                          ttl: 2*24*60*60  //2 DAYS EXPIRATION
                                        })
                }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ----- USE THIS TO FIND OUT WHATS HAPPENING ------
// app.use(function(req,res,next) {
//   console.log("*********************");
//   console.log("------ session is -----");
//   console.log(req.session);
//   console.log("*********************");
//   console.log("----- req.user details are -------");
//   console.log(req.user);
//   console.log("*********************");
//   next();
// })

app.set('view engine','ejs');

// app.use('/',function(req,res) {
//   res.send('(-_-); yo!');
//   console.log(req.cookies);
//   console.log('***********************');
//   console.log(req.session);
// });

var api = express.Router();
require('./app/routes/api.js')(api,passport);
app.use('/api',api);

var auth = express.Router();
require('./app/routes/auth.js')(auth,passport);
app.use('/auth',auth);

var secure = express.Router();
require('./app/routes/secure.js')(secure,passport);
app.use('/',secure);

//require('./app/routes.js')(app,passport);

app.listen(port,function() {
  console.log("magic happens at leet port");
});
