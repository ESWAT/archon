import React from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import './Message.css';

const Message = ({ message }) => {
  const { role, content, image, timestamp } = message;
  const isUser = role === 'user';
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        {image && (
          <div className="message-image-container">
            <img src={image} alt="User uploaded" className="message-image" />
          </div>
        )}
        <p>{content}</p>
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};

export default Message;
