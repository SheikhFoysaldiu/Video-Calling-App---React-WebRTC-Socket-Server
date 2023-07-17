const { Server } = require("socket.io");

const io = new Server(8000, {
  cors: { 
    origin: "*"
  }
});

const emailToSocketIdMap = new Map();
const socketIdToEmailMap = new Map();
io.on("connection", (socket) => {
    socket.on("room:join", (data) => {
    const { roomID, emailID } = data;
    emailToSocketIdMap.set(emailID, socket.id);
    socketIdToEmailMap.set(socket.id, emailID);


    socket.join(roomID);
    socket.emit("room:join", { roomID });
    socket.to(roomID).emit("user:joined", { emailID });

  });
  socket.on("send-offer", (data) => {
    const { offer, emailID } = data;
    console.log("offer", offer);
    const fromEmail = socketIdToEmailMap.get(socket.id);
    const socketId = emailToSocketIdMap.get(emailID);
    socket.to(socketId).emit("receive-offer", { offer, from : fromEmail });
  });
  socket.on("send-answer", (data) => {
    const { answer, emailID } = data;
    console.log("answer", answer);
    const socketId = emailToSocketIdMap.get(emailID);
    socket.to(socketId).emit("receive-answer", { answer});
  });
});