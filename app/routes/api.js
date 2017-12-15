module.exports= function(router,passport) {
  router.use(passport.authenticate('bearer',{ session: false}));
  router.get('/testAPI',function(req,res) {
    res.json({secretdata:process.env.YOUR_SECRET_DATA_STRING});
  })
}

//http://localhost:1337/api/testAPI?access_token=5a33030ef6219b1e87006273
//this to access data
