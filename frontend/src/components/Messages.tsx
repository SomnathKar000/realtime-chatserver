import React from "react";

const Messages = (props: { messages: string[] }) => {
  const { messages } = props;

  return (
    <div style={styles.messagesContainer}>
      <h2>Messages</h2>
      <ul style={styles.messageList}>
        {messages &&
          messages.map((message, index) => (
            <li key={index} style={styles.messageItem}>
              {message}
            </li>
          ))}
      </ul>
    </div>
  );
};

const styles = {
  messagesContainer: {
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    margin: "10px",
  },
  messageList: {
    listStyleType: "none",
    padding: "0",
  },
  messageItem: {
    marginBottom: "5px",
    padding: "8px",
    backgroundColor: "#f0f0f0",
    borderRadius: "3px",
  },
};

export default Messages;
