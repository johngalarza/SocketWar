const express = require('express');
const http = require("http")
const path = require('path');
const socketIO = require("socket.io")
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
let players = {};

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket)=>{
    console.log('Player connected', socket.id);
     players[socket.id] = {
        x: 0,
        y: 0,
        rotation: 0,
    };
    socket.emit('currentPlayers', players);

    socket.broadcast.emit('newPlayer', { id: socket.id, ...players[socket.id] });

    socket.on('move', (data)=>{
        if (players[socket.id]) {
            console.log('Jugador',socket.id,':',players[socket.id]);
            players[socket.id].x = data.x;
            players[socket.id].y = data.y;
            players[socket.id].rotation = data.rotation;

            socket.broadcast.emit('enemyMoved', { id: socket.id, ...data });
        }
    });

    socket.on('disconnect',()=>{
        delete players[socket.id];
        socket.broadcast.emit('enemyDisconnect', socket.id);
    })
})

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public'))
})
server.listen(port, ()=>[
    console.log('Servidor ejecutandose: http://localhost:'+port)
])