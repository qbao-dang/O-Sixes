var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET dummy login page (DEV ONLY) */
router.get('/dummy-login', function(req,res){
  res.render('dummy-login');
});

router.post('/dummy-login', passport.authenticate("login",{
  successRedirect: "/home",
  failureRedirect: "/dummy-login",
  failureFlash: true
}));

router.get('/dummy-logout', function(req, res){
  req.logout();
  res.redirect('/dummy-login');
});
module.exports = router;
