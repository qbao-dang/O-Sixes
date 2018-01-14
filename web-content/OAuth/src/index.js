const http = require('http');
const port = 8000;

const requestHander = (request, response) =>{
  console.log (request.url)
  response.end('Hello Node.js Server!')
}

const server
