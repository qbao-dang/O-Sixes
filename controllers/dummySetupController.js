const fs = require('fs');

exports.setUpMatchFile = function () {
  var data = {
    "maps": [],
    "banTurn": "UserA",
    "allMaps": [
      'hanamura',
      'horizon',
      'anubis',
      'volskaya',
      'dorado',
      'junkertown',
      'route66',
      'watchpoint',
      'eichenwalde',
      'hollywood',
      'kings',
      'numbani',
      'ilios',
      'lijiang',
      'nepal',
      'oasis'
    ]
  };
  data = JSON.stringify(data, null, 2);
  fs.writeFile('./dummy/match.json', data, (err) => {
    if (err) next(new Error('Failed to write in file.'));
    console.log('Match file updated successfully.');
  });
};
