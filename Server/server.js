const io = require("socket.io")(4000, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

var user = [];
var messageuser = [];
io.on("connection", (socket) => {
    socket.on("user join", (name, cb) => {
        const username = { id: socket.id, name };
        user.push(username);
        socket.broadcast.emit("response", user);
        cb(user);
    });

    socket.on("send-message", (datauser) => {
        const userMessage = { id: socket.id, reciever: datauser.message, userr: user[1].name };

        console.log(userMessage);
        if (messageuser[user]) {
            messageuser[user].push(userMessage);
        } else {
            messageuser[user] = [userMessage];
        }
        socket.to(datauser.reciever).emit("receive-message", datauser);
    });

    socket.on("disconnect", () => {
        user = user.filter((i) => i.id !== socket.id);
        socket.broadcast.emit("response", user);
        console.log(user);
    });
});
