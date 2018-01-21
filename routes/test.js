var express = require('express');
var matchTerminalController = require('../controllers/matchTerminalController');
var router = express.Router();

/* GET users listing. */
router.get('/send-sse', matchTerminalController.sse, function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
