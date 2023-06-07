const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const moment = require('moment'); //librería moment.js para formatear la hora

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar Express para servir archivos estáticos
app.use(express.static(__dirname));

// Ruta pág raíz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado');

  socket.on('username', (username) => {
    socket.username = username;
    socket.broadcast.emit('userJoined', username);
  });

  // socket.on('chatMessage', (message) => {
  //   const time = moment().format('HH:mm:ss'); // Formatear la hora actual
  //   io.emit('chatMessage', { username: socket.username, message: message, time: time });
  // });
  socket.on('chatMessage', (message) => {
    const time = new Date().toISOString(); // Obtener la hora actual 
    io.emit('chatMessage', { username: socket.username, message: message, time: time });
  });
  

  socket.on('disconnect', () => {
    io.emit('userLeft', socket.username);
  });
});

server.listen(8080, () => {
  console.log('Servidor escuchando en el puerto 8080');
});



//http://localhost:8080/
