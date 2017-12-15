var User = require('../models/user.js')
var assert = require('assert');

module.exports = function(router,passport) { //we are passing the passport object

  router.get('/',function(req,res) {
    res.render('index.ejs');
    var query = User.find({});
    console.log(query.exec().constructor);
    assert.equal(query.exec().constructor, global.Promise);
  });

  router.get('/login',function(req,res) {
    res.render('login.ejs',{message: req.flash('loginMessage')});
  })

  router.post('/login',passport.authenticate('local-login',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash:true
  }))

  router.get('/signup',function(req,res) {
    res.render('signup.ejs',{message: req.flash('signupMessage')});
  });

  router.post('/signup',passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
  }))

  // app.post('/signup',function(req,res) {
  //   var newUser = new User();
  //   newUser.local.username = req.body.email;
  //   newUser.local.password = req.body.password;
  //   console.log(newUser+" Here newUser bro");
  //   newUser.save(function(err) {
  //     if(err)
  //       throw err;
  //   });
  //   res.redirect('/');
  // });

  // router.get('/profile',isLoggedIn,function(req,res) {
  //   res.render('profile.ejs',{user: req.user});
  // });

  router.get('/facebook',
  passport.authenticate('facebook',{'scope': ['email']}));

  router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/profile');
    });

  router.get('/google',
  passport.authenticate('google',{'scope': ['profile','email']}));

  router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/profile');
    });


  router.get('/connect/facebook',passport.authorize('facebook',{'scope': ['email']}));

  router.get('/connect/google',passport.authorize('google',{'scope': ['profile','email']}));

  router.get('/connect/local',function(req,res) {
    res.render('connect-local.ejs',{message:req.flash("signupMessage")});
  });

  router.post('/connect/local',passport.authenticate('local-signup',{
    successRedirect: '/profile',
    failureRedirect: '/connect/local',
    failureFlash: true
  }))

  router.get('/unlink/facebook',function (req,res) {
    var user = req.user;
    user.facebook.token = null;
    user.save(function(err) {
      if(err)
        throw err;
      res.redirect('/profile');
    })
  });

  router.get('/unlink/google',function (req,res) {
    var user = req.user;
    user.google.token = null;
    user.save(function(err) {
      if(err)
        throw err;
      res.redirect('/profile');
    })
  });

  router.get('/unlink/local',function (req,res) {
    var user = req.user;
    user.local.username = null;
    user.local.password = null;
    user.save(function(err) {
      if(err)
        throw err;
      res.redirect('/profile');
    })
  });

  router.get('/logout',function(req,res) {
    req.logout();   //passport function makes req.res.passport.user = undefined
    res.redirect('/');
  })
  // app.get('/:username/:password',function(req,res) {
  //   var newUser = new User();
  //   newUser.local.username = req.params.username;
  //   newUser.local.password = req.params.password;
  //   console.log(newUser+" Here newUser bro");
  //   newUser.save(function(err) {
  //     if(err)
  //       throw err;
  //   });
  //   res.send('Sucess!!!');
  // });

}
