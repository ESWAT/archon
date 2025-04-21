import React, { useState, useRef, useContext, useEffect } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { FaPaperPlane, FaImage, FaSpinner } from 'react-icons/fa';
import './ChatInterface.css';
import Message from './Message';
import { translateText, translateImage } from '../services/translationService';

const ChatInterface = (props) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const { apiKey, model, systemInstruction, loading, setLoading } = useContext(SettingsContext);

  // --- Effects ---

  useEffect(() => {
    const handleGlobalKeyDown = (event) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        event.preventDefault();
        inputRef.current?.focus();
      } else if (event.key === 'Escape' && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, []);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chat_messages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to parse saved messages', e);
        localStorage.removeItem('chat_messages'); // Clear corrupted data
        setMessages([getWelcomeMessage()]);
      }
    } else {
      setMessages([getWelcomeMessage()]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chat_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (props.clearTrigger > 0) {
      clearChat();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.clearTrigger]);

  // --- Helper Functions ---

  const getWelcomeMessage = () => ({
    id: Date.now(),
    role: 'assistant',
    content: "Hello! I'm Archon. I can help translate text or images into English. How can I assist you today?",
    timestamp: new Date().toISOString()
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearChat = () => {
    setMessages([getWelcomeMessage()]);
  };

  const clearImage = () => {
    setImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  // --- Event Handlers ---

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        inputRef.current?.focus();
      }
      if (e.dataTransfer.items) {
        e.dataTransfer.items.clear();
      } else {
        e.dataTransfer.clearData();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !image) || loading) return;

    if (!apiKey) {
      addMessage({
        id: Date.now(),
        role: 'assistant',
        content: "Please set your OpenRouter API key in the settings before using the translation service.",
        timestamp: new Date().toISOString()
      });
      return;
    }

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      image: imagePreview, // Keep preview for user message display
      timestamp: new Date().toISOString()
    };

    addMessage(userMessage);
    const currentInput = input; // Store input before clearing
    const currentImage = image; // Store image before clearing
    setInput('');
    clearImage();
    setLoading(true);

    try {
      let responseContent;
      if (currentImage) {
        responseContent = await translateImage(currentImage, apiKey, model, systemInstruction);
      } else {
        responseContent = await translateText(currentInput, apiKey, model, systemInstruction);
      }

      addMessage({
        id: Date.now() + 1, // Ensure unique ID
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Translation error:', error);
      addMessage({
        id: Date.now() + 1, // Ensure unique ID
        role: 'assistant',
        content: `Sorry, there was an error processing your request: ${error.message}`,
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // --- Render ---

  return (
    <div
      className={`chat-container ${isDragging ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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

        <div className={`input-wrapper ${loading ? 'loading' : ''}`}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            placeholder="Type message, paste image, or press '/' to focus..."
            disabled={loading}
            className="message-input"
          />
          <button
            type="button"
            onClick={handleImageClick}
            className="upload-button"
            disabled={loading}
            aria-label="Upload image"
          >
            <FaImage />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
            aria-hidden="true"
          />
          <button
            type="submit"
            className="send-button"
            disabled={(!input.trim() && !image) || loading}
            aria-label="Send message"
          >
            {loading ? <FaSpinner className="spinner" aria-label="Sending"/> : <FaPaperPlane />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
