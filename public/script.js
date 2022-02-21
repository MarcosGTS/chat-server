const messages = document.querySelector(".messages");
const sendBtn = document.querySelector(".send");
const joinBtn = document.querySelector(".join");
const messageInput = document.querySelector("#message");

const chatState = [];

const socket = io();

//updating chatState
socket.on("update-chat", pkg => {
    renderChat(pkg);
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

//Add new messages to structure
function sendMessage(pkg) {
    socket.emit("user-message", pkg);
}

sendBtn.addEventListener("click", () => {
    const msg = messageInput.value;

    sendMessage({sender:"marcos", msg});
    messageInput.value = "";
})
