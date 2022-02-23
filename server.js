const express = require("express");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const PORT = 3000;

app.use("/", express.static("./public"));

// chatStatus
const chatStatus = [];

io.on("connection", socket => {
    console.log(`user [${socket.id}] connected`);
    io.to(socket.id).emit("update-chat", chatStatus);
    
    socket.on("user-message", pkg => {
        chatStatus.push(pkg);
        io.emit("update-chat", chatStatus);
    })

    socket.on("disconnected", () => {
        console.log(`user [${socket.id}] disconnected`)
    })
})

server.listen(PORT, () => {
    console.log(`Listening on PORT: [${PORT}]`);
})