/*Module depenacies*/
var PropertiesReader = require('../../node_modules/properties-reader');
var properties = PropertiesReader('./resources/config.properties');
var apiKey = properties.get(apiKey);
const BLIZZARD_API_KEY = require('./resources/config.properties').resources
const blizzard = require('../../node_modules/blizzard.js').initialize({appkey: });
var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    fs.readFile('Home.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
}).listen(8080);

