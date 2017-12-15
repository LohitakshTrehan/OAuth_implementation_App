module.exports = function(router,passport) {
  router.use(function(req,res,next) {
    if(req.isAuthenticated()){  // check whether the client is login or not using :
      return next();            //req.session.passport.user !== undefined
    }                           //You can think of isAuthenticated like this above expression
    res.redirect('/auth');
  })

  router.get('/profile',function(req,res) {
    res.render('profile.ejs',{user: req.user});
  });

  router.get('/*',function(req,res) {
    res.redirect('/profile');
  })
}
