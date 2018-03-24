var express = require('express');
var matchTerminalController = require('../controllers/matchTerminalController');
var bodyParser = require('body-parser');
var router = express.Router();

var jsonParser = bodyParser.json(); // middleware to parse json data in POST requests

router.use(matchTerminalController.setViewerData);

/* GET match terminal page */
router.get('/', matchTerminalController.getMatchTerminal);
/* GET specific match terminal */
router.get('/:matchid', matchTerminalController.getSpecificMatchTerminal);
/* GET for match terminal attendance */
router.get('/:matchid/attendance', matchTerminalController.getAttendance);
/* Create stream for match terminal */
router.get('/:matchid/sse', matchTerminalController.setSubscriber);
/* GET for match terminal map ban*/
router.get('/:matchid/ban-map/:mapName', matchTerminalController.getBanMap);
/* GET for banned map check */
router.get('/:matchid/check-banned-maps', matchTerminalController.getCheckBannedMaps);
/* POST map lock */
router.post('/:matchid/maplock', jsonParser, matchTerminalController.postMapLock);

/* Fire test event for match terminal */
router.get('/fire-event/:event_name', matchTerminalController.fireEvent);

module.exports = router;
