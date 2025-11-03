const express = require('express');
const http = require("http")
const path = require('path');
const port = 3000;

const app = express();
const server = http.createServer(app)

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, 'public'))
})
server.listen(port, ()=>[
    console.log('Servidor ejecutandose: http://localhost:'+port)
])