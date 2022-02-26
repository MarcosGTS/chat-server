const messages = document.querySelector(".messages");
const sendBtn = document.querySelector(".send");
const joinBtn = document.querySelector(".join");
const messageInput = document.querySelector("#message");

let ROOMS = {};
let currentRoom = "public";
let userName = "";

const socket = io();

//socket.init 
socket.on("init", rooms => {
    ROOMS = rooms;
    renderRooms()
})

//updating chatState
socket.on("update-chat", pkg => {
    renderChat(pkg);
})

//modal [Pop Up]
socket.on("connect", () => {
    
    //Setup Login screen
    const modalcontainer = document.querySelector(".modal-container");
    const confirmBtn = document.querySelector("#confirm");

    confirmBtn.addEventListener("click", () => {
        const nameValue = document.querySelector("#name").value;
        if (!nameValue) return;

        socket.emit("login", nameValue);

        userName = nameValue;
        modalcontainer.classList.add("hidde");
    })
    
})


//render chatState msgs sender -> message
function renderChat(chat) {
    //erase all messages in display
    messages.innerHTML = "";

    for (let msg of chat) {
       createMessage(msg);    
    }
}

function createMessage(pkg) {
    const {sender, msg} = pkg;
  
    //Creating nodes
    const container = document.createElement("div");
    const msgSender = document.createElement("span");
    const msgContent = document.createElement("p");

    //Assing classes
    container.classList.add("message-box");

    //Adding message content
    msgSender.textContent = sender;
    msgContent.textContent = msg;

    //Adding sender and msg
    container.appendChild(msgSender);
    container.appendChild(msgContent);
    
    messages.appendChild(container);
}

//render Room 
function renderRooms() {  
    const roomsContainer = document.querySelector(".sidebar-nav");
    roomsContainer.innerHTML = "";

    for (let room in ROOMS) {
        const newRoomNode = createRoomNode(room);
        roomsContainer.appendChild(newRoomNode);
    }
        
}

function createRoomNode(roomId) {
    
    const listItem = document.createElement("li");
    listItem.classList.add("nav-item");
    listItem.textContent = roomId;

    listItem.addEventListener("click", () => {
        currentRoom = roomId;
        socket.emit("update-room", roomId);
        console.log(roomId);
    })

    return listItem;
}

//Add new messages to structure
function sendMessage(pkg) {
    socket.emit("user-message", pkg);
}

sendBtn.addEventListener("click", () => {
    const msg = messageInput.value;
    
    sendMessage({
        sender: userName,
        msg,
        roomId: currentRoom,
    });

    messageInput.value = "";
})
