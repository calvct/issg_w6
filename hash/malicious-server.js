const http = require("http");
const socketio = require("socket.io");

const server = http.createServer();
const io = socketio(server);

io.on("connection", (socket) => {
  console.log(`Client ${socket.id} connected`);

  socket.on("disconnect", () => {
    console.log(`Client ${socket.id} disconnected`);
  });
  socket.on("message", (data) => {
    let { username, message } = data;
    console.log(`Receiving message from ${username}: ${message}`);

    message = message + " (?sus)";
    io.emit("message", { username, message });
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
