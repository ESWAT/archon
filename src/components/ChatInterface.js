import React, { useState, useRef, useContext, useEffect } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { FaPaperPlane, FaImage, FaSpinner } from 'react-icons/fa';
import './ChatInterface.css';
import Message from './Message';
import { translateText, translateImage } from '../services/translationService';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { apiKey, model, loading, setLoading } = useContext(SettingsContext);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
      }
    } else {
      // Add welcome message if no saved messages
      const welcomeMessage = {
        id: Date.now(),
        role: 'assistant',
        content: "Hello! I'm your language teacher. I can help translate text or images into English. How can I assist you today?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  
  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          e.preventDefault();
          setImage(file);
          
          // Create image preview
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result);
          };
          reader.readAsDataURL(file);
          break;
        }
      }
    }
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if ((!input.trim() && !image) || loading) return;
    
    if (!apiKey) {
      const newMessage = {
        id: Date.now(),
        role: 'assistant',
        content: "Please set your OpenRouter API key in the settings before using the translation service.",
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, newMessage]);
      return;
    }

    // Add user message
    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      image: imagePreview,
      timestamp: new Date().toISOString()
    };
    
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);
    
    try {
      let response;
      
      if (image) {
        // Handle image translation
        response = await translateImage(image, apiKey, model);
        clearImage();
      } else {
        // Handle text translation
        response = await translateText(input, apiKey, model);
      }
      
      const assistantMessage = {
        id: Date.now(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Translation error:', error);
      
      const errorMessage = {
        id: Date.now(),
        role: 'assistant',
        content: `Sorry, there was an error processing your request: ${error.message}`,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      role: 'assistant',
      content: "Hello! I'm your language teacher. I can help translate text or images into English. How can I assist you today?",
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Language Teacher</h2>
        <button onClick={clearChat} className="clear-chat-button">Clear Chat</button>
      </div>
      
      <div className="messages-container">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="input-container">
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Upload preview" className="image-preview" />
            <button type="button" onClick={clearImage} className="clear-image-button">×</button>
          </div>
        )}
        
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onPaste={handlePaste}
            placeholder="Type a message in any language or paste an image..."
            disabled={loading}
            className="message-input"
          />
          
          <button 
            type="button" 
            onClick={handleImageClick} 
            className="upload-button"
            disabled={loading}
          >
            <FaImage />
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          
          <button 
            type="submit" 
            className="send-button"
            disabled={(!input.trim() && !image) || loading}
          >
            {loading ? <FaSpinner className="spinner" /> : <FaPaperPlane />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
