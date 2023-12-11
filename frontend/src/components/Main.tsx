import React, { useState, useEffect } from "react";
import Messages from "./Messages";
import { EventEmitter } from "./EventEmitter";

interface SocketEvent {
  type: string;
  data: any;
}

interface MessageData {
  content: string;
  sender?: string;
}

interface SocketService {
  socket: WebSocket;
  listener: EventEmitter;
}

const useSocketService = (): SocketService => {
  const [socket] = useState(new WebSocket("ws://localhost:8000"));
  const [listener] = useState(() => new EventEmitter());

  useEffect(() => {
    const handleOpen = (event: Event) => {
      listener.emit("open", event);
    };

    const handleClose = (event: CloseEvent) => {
      listener.emit("close", event);
    };

    const handleMessage = (event: MessageEvent) => {
      listener.emit("message", JSON.parse(event.data) as MessageData);
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("close", handleClose);
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("close", handleClose);
      socket.removeEventListener("message", handleMessage);
      socket.close();
    };
  }, [socket, listener]);

  return { socket, listener };
};

const Main: React.FC = () => {
  const { socket, listener } = useSocketService();
  const [messages, setMessages] = useState<string[]>([]);
  const [chatBox, setChatBox] = useState<string>("");

  useEffect(() => {
    const handleSocketEvent = (event: SocketEvent) => {
      if (event.type === "message") {
        let data = event.data.content;
        if (event.data.sender) {
          data = event.data.sender + ": " + data;
        }
        setMessages((prevMessages) => [...prevMessages, data]);
      }
      if (event.type === "close") {
        setMessages((prevMessages) => [
          ...prevMessages,
          "The socket connection has been closed",
        ]);
      }
      if (event.type === "open") {
        setMessages((prevMessages) => [
          ...prevMessages,
          "The socket connection has been established",
        ]);
      }
    };

    const { unsubscribe } = listener.subscribe(handleSocketEvent);

    return () => {
      unsubscribe();
    };
  }, [listener]);

  const send = () => {
    if (chatBox) {
      socket.send(chatBox);
      setChatBox("");
    }
  };

  const isSystemMessage = (message: string): string => {
    return message.startsWith("/")
      ? "<strong>" + message.substring(1) + "</strong>"
      : message;
  };

  return (
    <div>
      <div>
        <input
          type="text"
          value={chatBox}
          onChange={(e) => setChatBox(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={send}>Send</button>
      </div>
      <Messages
        messages={messages.map((message) => isSystemMessage(message))}
      />
    </div>
  );
};

export default Main;
