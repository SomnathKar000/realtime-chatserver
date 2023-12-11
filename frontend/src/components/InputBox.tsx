import React, { useState } from "react";
interface InputBoxProps {
  addMessage: (message: string) => void;
  socket: WebSocket | null;
}
const InputBox: React.FC<InputBoxProps> = (props) => {
  const [message, setMessage] = useState("");
  const addMessages = props.addMessage;

  const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleButtonOnClick = () => {
    if (message !== "") {
      addMessages(message);
      props.socket?.send(message);
      setMessage("");
    }
  };

  return (
    <div className="input-group mb-3">
      <input
        type="text"
        className="chatBox"
        placeholder="Enter the message"
        aria-label="Enter the message"
        aria-describedby="button-addon2"
        onChange={handleInputOnChange}
        value={message}
      />
      <button
        onClick={handleButtonOnClick}
        className="btn btn-primary"
        type="button"
        id="button-addon2"
      >
        Send
      </button>
    </div>
  );
};

export default InputBox;
