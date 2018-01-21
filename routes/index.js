var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* GET dummy login page (DEV ONLY) */
router.get('/dummy-login', function(req,res){
  res.render('dummy-login');
});

module.exports = router;
