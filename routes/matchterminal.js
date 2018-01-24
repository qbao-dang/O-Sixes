var express = require('express');
var matchTerminalController = require('../controllers/matchTerminalController');
var router = express.Router();


router.use(matchTerminalController.setViewerData);

/* GET users listing. */
router.get('/', matchTerminalController.getMatchTerminal);
/* GET specific match terminal */
router.get('/:matchid', matchTerminalController.getSpecificMatchTerminal)
/* Create stream for match terminal */
router.get('/sse', matchTerminalController.setSubscriber);
/* Fire test event for match terminal */
router.get('/fire-event/:event_name', matchTerminalController.fireEvent);

module.exports = router;
