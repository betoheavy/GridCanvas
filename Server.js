const express 	= require('express');
const app 		= express();
const http 		= require('http').Server(app);
const io 		= require('socket.io')(http);
const path = require('path');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/src/imageEditor'));
app.use('/@',express.static(__dirname + '/public/src'));

/** @type RequestHandler */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// app.get('/**ruta**', function (req, res) {
//   res.sendFile(__dirname + **archivo html **  );
// });

app.get('/editor', function (req, res) {
  let options = {
    root: path.join(__dirname, '/public/src/imageEditor')
  }
  res.sendFile('index.html', options)
  // res.sendFile(__dirname + '/public/src/imageEditor/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

app.listen(3000, () => {
  console.log('Server listening on http://localhost:3000 ' + __dirname);
});