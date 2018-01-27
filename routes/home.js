var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Set cookie containing username (REPLACE WITH A "SAFE ID" IN THE FUTURE)
  res.cookie('username', req.user, {maxAge: 86400000});
  res.render('home');
});

module.exports = router;
