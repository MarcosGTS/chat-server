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
        },
        "public1": {
            history:[],
            users:[]
        }
    },
    USERS:{
        "userId": {
            name: "marcos",
            roomId: "public",
        }
    }
};

io.on("connection", socket => {
    console.log(`user [${socket.id}] connected`);
    
    const publicMgs = chatStatus.ROOMS["public"].history
    
    io.to(socket.id).emit("init", chatStatus.ROOMS);

    socket.on("login", userName => {
        chatStatus.USERS[socket.id] = {
            userName,
            roomId:"public",
        }

        console.log(chatStatus.USERS);
    })
    
    socket.on("user-message", pkg => {
        const letter = {sender: pkg.sender, msg: pkg.msg};

        //cheking empty msg 
        // if (!letter.msg) return;

        const room = chatStatus.ROOMS[pkg.roomId];

        room.history.push(letter);
       
        const { USERS } = chatStatus;

        for (let userId in USERS) {
            let { roomId } = USERS[userId];

            if (roomId != pkg.roomId) continue;
            io.to(userId).emit("update-chat", room.history);
        }
        
    })

    socket.on("update-room", roomId => {
        chatStatus.USERS[socket.id].roomId = roomId;
    })

    socket.on("disconnect", () => {
        delete chatStatus.USERS[socket.id];
        console.log(`user [${socket.id}] disconnected`);
    })
})

server.listen(PORT, () => {
    console.log(`Listening on PORT: [${PORT}]`);
})