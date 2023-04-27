import { io } from "socket.io-client";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const socket = io("http://localhost:4000");
function App() {
  const messageInput = useRef("");
  const roomInput = useRef("");
  const [messages, setmessages] = useState([]);
  const [user, setusers] = useState([]);

  useEffect(() => {
    socket.on("receive-message", (message) => {
      setmessages((o) => [...o, message]);
      displayMessage(`${socket.id}`);
    });

    socket.on("response", (user) => {
      setusers(user.filter((i) => i !== socket.id));
    });

    socket.emit("user join", (users) => {
      setusers(users);
    });
    socket.emit('leave-room', (user) => {
      setusers(user)
    })
  }, []);

  console.log("socket...", socket.id);

  const form = (e) => {
    e.preventDefault();
    const message = messageInput?.current.value;
    const room = roomInput.current.value;

    if (message === "") return;
    setmessages((o) => [...o, message]);
    console.log("room", room);
    socket.emit("send-message", message, room);
    messageInput.current.value = "";
  };

  function displayMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    document.getElementById("messagecontainer").append(div);
    console.log("messagecontainer".message);
  }

  return (
    <>
      <div id="messagecontainer" className="main">
        {messages.map((item) => {
          return <div>{item}</div>;
        })}
      </div>
      <form onClick={form}>
        <input type="text" ref={messageInput} />
        <button type="submit">send</button>
        <input type="text" ref={roomInput} />
      </form>

      <div>
        {user.map((item) => {
          return (
            <>
              <div className="main_user">
                <div>{item}</div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
}

export default App;
