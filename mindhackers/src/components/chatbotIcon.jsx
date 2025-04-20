import React, { useState } from 'react';
import ChatBot from './chatbot'; // Ensure case matches filename
import './chatbotIcon.css';

const ChatbotIcon = ({ darkMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Chatbot Icon */}
      <div 
        className={`chatbot-icon ${darkMode ? 'dark' : ''}`} 
        onClick={toggleChat}
      >
        <span role="img" aria-label="Chat">💬</span>
      </div>
      
      {/* Chatbot Modal */}
      {isOpen && (
        <div className={`chatbot-modal ${darkMode ? 'dark' : ''}`}>
          <div className="chatbot-header">
            <h3>VibeBot</h3>
            <button className="close-btn" onClick={toggleChat}>✕</button>
          </div>
          {/* ChatBot Component Rendered Inside Modal */}
          <ChatBot darkMode={darkMode} />
        </div>
      )}
    </>
  );
};

export default ChatbotIcon;
