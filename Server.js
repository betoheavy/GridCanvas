const express 	= require('express');
const app 		= express();
const http 		= require('http').Server(app);
const io 		= require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

/** @type RequestHandler */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});
app.get('/2', function (req, res) {
  res.sendFile(__dirname + '/public/test2.html');
});
app.get('/3', function (req, res) {
  res.sendFile(__dirname + '/public/test3.html');
});
app.get('/4', function (req, res) {
  res.sendFile(__dirname + '/public/test4.html');
});


io.on('connection', (socket) => {
  console.log('a user connected');
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ' + __dirname);
});