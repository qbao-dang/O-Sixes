var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.status(200);
/*
  res.set({
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });
*/
  // Send data to the client
  res.render('matchterminal');
});



module.exports = router;
