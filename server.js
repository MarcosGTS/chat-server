const express = require("express");
const app = express();
const server = require("http").createServer(app);
const {Server} = require("socket.io");
const io = new Server(server);

const PORT = 3000;

app.use("/", express.static("./public"));

let roomsCounter = 0;

// chatStatus
const chatStatus = {
    ROOMS:{
        "public": {
            history:[],
            users:[]
        }
    },
    USERS:{
        "userId": {
            name: "marcos",
            rooms: []
        }
    }
};

io.on("connection", socket => {
    console.log(`user [${socket.id}] connected`);
    
    
    const publicMgs = chatStatus.ROOMS["public"].history
    
    io.to(socket.id).emit("update-chat", publicMgs);

    socket.on("login", userName => {
        chatStatus.USERS[socket.id] = {
            userName,
            rooms:["public"],
        }

        console.log(chatStatus.USERS);
    })
    
    socket.on("user-message", pkg => {
        const {letter} = pkg;

        //cheking empty msg 
        if (!letter.msg) return;

        const room = chatStatus.ROOMS[pkg.roomId];

        room.history.push(letter);
        io.emit("update-chat", room.history);
    })

    socket.on("disconnect", () => {
        delete chatStatus.USERS[socket.id];
        console.log(chatStatus.USERS);
        console.log(`user [${socket.id}] disconnected`);
    })
})

server.listen(PORT, () => {
    console.log(`Listening on PORT: [${PORT}]`);
})