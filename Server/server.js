const io = require("socket.io")(4000, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

var user = [];
io.on("connection", (socket) => {
    socket.on("user join", (cb) => {
        cb(user);
        user.push(socket.id);
        socket.broadcast.emit("response", user);
    });

    console.log(socket.id);
    socket.on("send-message", (message, room) => {
        if (room) {
            socket.to(room).emit("receive-message", message);
        } else {
            socket.broadcast.emit("receive-message", message);
        }
    });

    socket.on("disconnect", () => {
        user = user.filter((i) => i !== socket.id);
        socket.broadcast.emit("response", user);
    });
    socket.on("typing", (user) => {
        socket.broadcast.emit("typing", user);
    });
});
