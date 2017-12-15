module.exports = {
  'facebookAuth' : {
    'clientID' : process.env.FACEBOOK_CLIENT_ID,
    'clientSecret' : process.env.FACEBOOK_CLIENT_PASS,
    'callbackURL' : 'http://localhost:1337/auth/facebook/callback',
    'profileFields'   : ['emails','first_name','last_name']
  },
  'googleAuth' : {
    'clientID' : process.env.GOOGLE_CLIENT_ID,
    'clientSecret' : process.env.GOOGLE_CLIENT_PASS,
    'callbackURL' : 'http://localhost:1337/auth/google/callback',
    //'profileFields'   : ['emails','first_name','last_name']
  }
}
