import React from 'react';
import ReactMarkdown from 'react-markdown'; 
import rehypeRaw from 'rehype-raw'; 
import './Message.css';

const Message = ({ message }) => {
  const { role, content, image, timestamp } = message;
  const isUser = role === 'user';

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }); 
  };

  return (
    <div className={`message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-content">
        {image && (
          <div className="message-image-container">
            <img src={image} alt="User uploaded" className="message-image" />
          </div>
        )}
        {isUser ? (
          <p>{content}</p> 
        ) : (
          <div className="markdown-content">
            
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown> 
          </div>
        )}
        <span className="message-time">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
};

export default Message;
