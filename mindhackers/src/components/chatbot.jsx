import React, { useState, useEffect } from "react";
import "./chatbot.css";  // You can style this separately if you want

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    if (userMessage.trim() === "") return;

    // Add user message to the chat
    setMessages([...messages, { text: userMessage, isUser: true }]);
    setLoading(true);
    setUserMessage("");

    try {
      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: data.reply, isUser: false },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Sorry, something went wrong!", isUser: false },
      ]);
    }

    setLoading(false);
  };

  useEffect(() => {
    // Scroll to the latest message
    const chatContainer = document.getElementById("chatContainer");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>ZenBot</h2>
      </div>
      <div id="chatContainer" className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.isUser ? "user" : "bot"}`}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div className="loading">...</div>}
      </div>
      <form className="message-form" onSubmit={handleMessageSubmit}>
        <input
          type="text"
          placeholder="Type your message here..."
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatBot;
