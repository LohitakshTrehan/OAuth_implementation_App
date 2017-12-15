 var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt = require('bcrypt');
//Making a User Schema Here

var userSchema = mongoose.Schema({
  local: {
    username: String,
    password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
  google: {
    id: String,
    token: String,
    email: String,
    name: String
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password,this.local.password);
}

module.exports = mongoose.model('User', userSchema,'CollectionName');

// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
//
// var blogSchema = new Schema({
//   title:  String,
//   author: String,
//   body:   String,
//   comments: [{ body: String, date: Date }],
//   date: { type: Date, default: Date.now },
//   hidden: Boolean,
//   meta: {
//     votes: Number,
//     favs:  Number
//   }
// });
// var Blog = mongoose.model('Blog', blogSchema);


// //Indexes
// var animalSchema = new Schema({
//   name: String,
//   type: String,
//   tags: { type: [String], index: true } // field level
// });
//
// animalSchema.index({ name: 1, type: -1 }); // schema level


// //Qeurying
// var Person = mongoose.model('Person', yourSchema);
//
// // find each person with a last name matching 'Ghost', selecting the `name` and `occupation` fields
// Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
//   if (err) return handleError(err);
//   console.log('%s %s is a %s.', person.name.first, person.name.last, person.occupation) // Space Ghost is a talk show host.
// })


// // Using query builder
// Person.
//   find({ occupation: /host/ }).
//   where('name.last').equals('Ghost').
//   where('age').gt(17).lt(66).
//   where('likes').in(['vaporizing', 'talking']).
//   limit(10).
//   sort('-occupation').
//   select('name occupation').
//   exec(callback);


// //cursor
// var cursor = Person.find({ occupation: /host/ }).cursor();
// cursor.on('data', function(doc) {
//   // Called once for every document
// });
// cursor.on('close', function() {
//   // Called when done
// });
// https://www.youtube.com/watch?v=9vmas8Pwhqc&index=8&list=PLZm85UZQLd2Q946FgnllFFMa0mfQLrYDL
