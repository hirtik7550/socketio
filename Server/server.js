const io = require("socket.io")(4000, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

var user = [];
io.on("connection", (socket) => {
    socket.on("user join", (name, cb) => {
        const username = { id: socket.id, name }
        user.push(username);
        console.log("username0", username)
        socket.broadcast.emit("response", user);
        cb(user);
    });

    socket.on("send-message", (message, datauser) => {
        if (datauser.id) {
            socket.to(datauser.id).emit("receive-message", message);
        } else {
            socket.broadcast.emit("receive-message", message);
        }
    });

    socket.on("disconnect", () => {
        user = user.filter((i) => i.id !== socket.id);
        socket.broadcast.emit("response", user);
        console.log(user);
    });

});
