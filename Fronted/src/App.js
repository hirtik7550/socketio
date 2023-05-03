import { io } from "socket.io-client";
import "./App.css";
import { MdSend } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Form, Formik } from "formik";
import * as Yup from "yup";

const socket = io("http://localhost:4000");
function App() {
  const messageInput = useRef("");
  const [messages, setmessages] = useState([]);
  const [user, setusers] = useState([]);
  const [datauser, setdatausers] = useState([]);
  const [name, setname] = useState([]);
  const [userText, setuserText] = useState([]);
  const [show, setShow] = useState(true);

  const handleClose = () => {
    if (datauser.name !== '') {

      setShow(false)
    }
  };
  useEffect(() => {
    socket.on("receive-message", (message) => {
      setmessages((o) => [...o, message]);
      setuserText(socket.id);
    });

    socket.on("response", (user) => {
      setusers(user.filter((i) => i.id !== socket.id));
    });

    socket.emit("leave-room", (user) => {
      setusers(user);
    });
  }, []);



  const form = (e) => {
    e.preventDefault();
    const message = messageInput?.current.value;
    if (message === "") return;

    const messageWithUser = {
      message,
      reciever: datauser.id,
      sender: socket.id,
      name,
    };
    console.log("messageWithUser..", messageWithUser);
    setmessages((o) => [...o, messageWithUser]);
    socket.emit("send-message", messageWithUser);
    messageInput.current.value = "";
    console.log(socket.id);
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("required"),
  });

  const inputname = (values) => {
    setname(values.name);
    console.log("values", values);
    socket.emit("user join", values.name, (user) => {
      setusers(user.filter((i) => i.id !== socket.id));
    });
  };

  return (
    <>
      <div className="d-flex">
        <div className="main_navbar">
          {user.map((item) => {
            return (
              <>
                <div className=" align-items-center p-3 ">
                  <button
                    onClick={(id) => setdatausers(item)}
                    className="main_card"
                  >
                    {item.name}
                  </button>
                </div>
              </>
            );
          })}
        </div>
        <div className="main position-relative ">
          <div className="chatBox d-inline-block container">
            {messages.map((item) => {
              console.log("item...".item);
              if (
                item.sender === socket.id || item.id === socket.id ? "" : item.sender
              ) {
                return (
                  <div className="div_left ">
                    <div className={"left"}>{`${name}:${item.message}`}</div>
                  </div>
                );
              } else {
                return (
                  <div className="div_right ">
                    <div className={"right"}>{`You:${item.message}`}</div>
                  </div>
                );
              }
            })}
          </div>
          <div className="position-absolute w-100 border border-1 p-3 top-navbar ">
            <h4>{datauser.name}</h4>
            {console.log(datauser.name)}
          </div>
          <form
            onSubmit={form}
            className="input_text d-flex m-5 justify-content-center d-flex align-items-center w-100"
          >
            <input type="text" className="p-2" ref={messageInput} />
            <button type="submit">
              <MdSend />
            </button>
          </form>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static">
        <Formik
          initialValues={{
            name: "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            if (values.name) {
              setSubmitting(true);
            }
            inputname(values);
          }}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            values,
            touched,
            isValid,
            errors,
          }) => (
            <Form onSubmit={handleSubmit}>
              <Modal.Header>
                <Modal.Title>Socket io</Modal.Title>
              </Modal.Header>
              <div className="d-flex align-items-center justify-content-center">
                <div className="p-3 d-flex">
                  <div className="me-3">Name</div>
                  <input
                    type="text"
                    name="name"
                    className="input_name"
                    onChange={handleChange}
                    id="horizontal-firstname-Input"
                    placeholder="Name"
                    invalid={touched.name && errors.name}
                  />
                  <div className="invalid-feedback position-absolute">
                    {errors.name}
                  </div>
                </div>
              </div>
              <Modal.Footer>
                <Button variant="primary" type="submit" onClick={handleClose}>
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}

export default App;
