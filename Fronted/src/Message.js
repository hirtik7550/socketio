import "./Message.css"
const Message = ({ user, message, classs }) => {
    if (user) {
        console.log("user....".user);
        return (
            <div className={`message ${classs}`}>{`${user}:${message}`}</div>
        )
    } else {
        <div className={`message ${classs}`}>{`${user}:${message}`}</div>

    }

    return (<>

    </>)
}
export default Message;