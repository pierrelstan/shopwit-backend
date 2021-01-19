const http = require('http');
const serverless = require('serverless-http');
const app = require('./app.js');

app.set('port', process.env.PORT || 4000);
const server = http.createServer(app);
serverless(app);
server.listen(process.env.PORT || 4000);
