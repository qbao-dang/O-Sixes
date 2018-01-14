const router = require('express').Router();
const passport = require('passport');

//auth Logout
router.get('/logout', (req, res) => {
//handle with passport
  //req.logout();
  res.redirect('/');
});

//auth with Bnet
router.get('/bnet', passport.authenticate ('bnet',{
    scope:['profile']
}));

app.get('/bnet/callback',
passport.authenticate('bnet', { failureRedirect: '/' }),
=>(req, res){
  res.redirect('https://localhost:8080/home');
});

module.exports = router;
