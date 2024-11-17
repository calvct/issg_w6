const io = require("socket.io-client");
const readline = require("readline");
const crypto = require("crypto");

const socket = io("http://localhost:3000");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "> ",
});

let username = "";

socket.on("connect", () => {
  console.log("Connected to the server");
  rl.question("Enter your username: ", (input) => {
    username = input;
    console.log(`Welcome, ${username} to the chat`);
    rl.prompt();
    rl.on("line", (message) => {
      if (message.trim()) {
        const hashMsg = crypto
          .createHash("sha256")
          .update(message)
          .digest("hex");
        socket.emit("message", { username, message, hashMsg });
      }
      rl.prompt();
    });
  });
});
socket.on("message", (data) => {
  const {
    username: senderUsername,
    message: senderMessage,
    hashMsg: senderHash,
  } = data;
  if (senderUsername != username) {
    const checkHash = crypto
      .createHash("sha256")
      .update(senderMessage)
      .digest("hex");
    if (checkHash === senderHash) {
      console.log(`${senderUsername}: ${senderMessage}`);
    } else {
      console.log(`${senderUsername} (modified): ${senderMessage}`);
    }
    rl.prompt();
  }
});
socket.on("disconnect", () => {
  console.log("Server disconnected, Exiting...");
  rl.close();
  process.exit(0);
});

rl.on("SIGINT", () => {
  console.log("\nExiting...");
  socket.disconnect();
  rl.close();
  process.exit(0);
});
