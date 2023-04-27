import { io } from "socket.io-client";
import "./App.css";
import { useEffect, useRef, useState } from "react";

const socket = io("http://localhost:4000");
function App() {
  const messageInput = useRef("");
  const roomInput = useRef("");
  const [messages, setmessages] = useState([]);

  console.log("messageInput", messageInput);


  useEffect(() => {
    socket.on("receive-message", (message) => {
      setmessages((o) => [...o, message]);
      displayMessage(`you Connected with id:${socket.id}`)
    });
  }, []);
  console.log("socket.id", socket.id);
  const form = (e) => {
    e.preventDefault();
    const message = messageInput?.current.value;
    const room = roomInput.current.value;

    if (message === "") return;
    setmessages((o) => [...o, message]);
    console.log("room", room)
    socket.emit("send-message", message);
    messageInput.current.value = "";
  };

  const joinRoomButton = (e) => {
    e.preventDefault()
    const room = roomInput.current.value;
    console.log("roomInput", roomInput.current.value);
    socket.emit("join-room", room, (message) => {
      displayMessage(message)
    });
  };

  function displayMessage(message) {
    const div = document.createElement("div");
    div.textContent = message;
    document.getElementById("messagecontainer").append(div);
    console.log("messagecontainer".message);
  }

  return (
    <>
      <div id="messagecontainer" className="main" >
        {
          messages.map((item) => {
            return (
              <div>
                {item}
              </div>
            )
          })
        }
      </div>
      <form onClick={form}>
        <input type="text" ref={messageInput} />
        <button type="submit">send</button>
        <input type="text" ref={roomInput} />
        <button type="button" onClick={joinRoomButton}>
          admin
        </button>
      </form>
    </>
  );
}

export default App;
