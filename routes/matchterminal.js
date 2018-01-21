var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // Send data to the client
  res.render('matchterminal');
});

module.exports = router;
