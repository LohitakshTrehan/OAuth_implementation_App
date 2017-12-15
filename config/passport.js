var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var User = require('../app/models/user.js');//give access to user schema
var configAuth = require('./auth.js');

module.exports=function(passport) {
  passport.serializeUser(function(user,done) {
    done(null,user.id);
  });
  passport.deserializeUser(function(id,done) {
    User.findById(id,function(err,user) {
      done(err,user);
    });
  });

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',  // as defined in signup.ejs
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req,email,password,done) {
    process.nextTick(function() {
      User.findOne({'local.username': email},function(err,user) {
        if(err)
          done(err);
        if(user){
          return done(null,false,req.flash('signupMessage','That E-mail is already taken'));
        }
        if(!req.user) {
          var newUser = new User();
          newUser.local.username=email;
          newUser.local.password = newUser.generateHash(password); //Will hash them later
          newUser.save(function(err) {
            if(err)
              throw err;
            else {
              return done(null,newUser);
            }
          })
        }
        else {
          var user = req.user;
          user.local.username = email;
          user.local.password = user.generateHash(password);

          user.save(function(err){
            if(err)
              throw err;
            return done(null,user);
          })
        }
      })
    })
  }
  ))

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req,email,password,done) {
      process.nextTick(function() {
        User.findOne({'local.username': email},function(err,user) {
          if(err)
            done(err);
          if(!user)
            return done(null,false,req.flash('loginMessage','No user with the e-mail found'));
          if(!user.validPassword(password))
            return done(null,false,req.flash('loginMessage','Inncorrect password'));
          return done(null,user);
        })
      })
    }
  ))

  passport.use(new FacebookStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      callbackURL: configAuth.facebookAuth.callbackURL,
      profileFields   : configAuth.facebookAuth.profileFields,
      passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      process.nextTick(function(){
          //2 cases :
          ///user is not logged in stylesheet----- this means we have req.user object
          //user is logged in already, need to be merged
        if(!req.user){
          User.findOne({'facebook.id': profile.id},function(err,user) {
            if(err)
              return done(err);
            if(user){
              if(!user.facebook.token){
                user.facebook.token= accessToken;
                user.facebook.name= profile.name.givenName + ' ' + profile.name.familyName;
                user.facebook.email= profile.emails[0].value || null;
                user.save(function(err) {
                  if(err)
                    throw err;
                  return done(null,user);
                })
              }
              return done(null,user)
            }
            else {
              //the user doesnt exist till now, make one
              var newUser = new User();
              newUser.facebook.id= profile.id;
              newUser.facebook.token= accessToken;
              newUser.facebook.name= profile.name.givenName + ' ' + profile.name.familyName;
              newUser.facebook.email= profile.emails[0].value || null;
              newUser.save(function(err){
                if(err)
                  throw err;
                else {
                  done(null,newUser);
                }
              })
            }
          });
        }
        else{
          var user = req.user;
          user.facebook.id= profile.id;
          user.facebook.token= accessToken;
          user.facebook.name= profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email= profile.emails[0].value || null;
          user.save(function(err) {
            if(err)
             throw err
            else {
              return done(null,user);
            }
          })
        }
      });
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: configAuth.googleAuth.clientID,
      clientSecret: configAuth.googleAuth.clientSecret,
      callbackURL: configAuth.googleAuth.callbackURL,
      profileFields   : configAuth.googleAuth.profileFields,
      passReqToCallback: true
    },
    function(req,accessToken, refreshToken, profile, done) { //done is the callback
      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
      process.nextTick(function(){
        if(!req.user){
          User.findOne({'google.id': profile.id},function(err,user) {
            if(err)
              return done(err);
            if(user){
              if(!user.google.token){
                user.google.token= accessToken;
                user.google.name= profile.displayName;
                user.google.email= profile.emails[0].value || null;
                user.save(function(err) {
                  if(err)
                    throw err;
                  return done(null,user);
                })
              }
              return done(null,user)
            }
            else {
              //the user doesnt exist till now, make one
              var newUser = new User();
              newUser.google.id= profile.id;
              newUser.google.token= accessToken;
              newUser.google.name= profile.displayName;
              newUser.google.email= profile.emails[0].value || null;
              newUser.save(function(err){
                if(err)
                  throw err;
                else {
                  done(null,newUser);
                }
              })
            }
          });
        }
        else{
          var user = req.user;
          user.google.id= profile.id;
          user.google.token= accessToken;
          user.google.name= profile.displayName;
          user.google.email= profile.emails[0].value || null;
          user.save(function(err) {
            if(err)
             throw err
            else {
              return done(null,user);
            }
          })
        }
      });
    }
  ));

  passport.use(new BearerStrategy({},function (token,done) {
    User.findOne({_id:token},function(err,user) {
      if(!user)
        done(null,false);
      else {
        return done(null,user);
      }
    })
  }))


}
