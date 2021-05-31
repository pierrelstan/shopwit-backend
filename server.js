const http = require('http');
const app = require('./app.js');

app.set('port', process.env.PORT);
const server = http.createServer(app);
server.listen(process.env.PORT);
console.log( process.env.PORT)
