var http = require('http');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h>Welcome to 0-Sixes</h>');
    res.end('<p>Something went wrong, Winston is already on it!</p>');
}).listen(8080);