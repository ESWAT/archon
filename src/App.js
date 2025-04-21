import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import ChatInterface from './components/ChatInterface';
import Settings from './components/Settings';
import Header from './components/Header';
import { SettingsProvider } from './contexts/SettingsContext';

function App() {
  const [clearChatTrigger, setClearChatTrigger] = useState(0);

  const handleClearChat = () => {
    setClearChatTrigger(prev => prev + 1);
  };

  return (
    <SettingsProvider>
      <Router>
        <div className="app">
          <Header onClearChat={handleClearChat} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<ChatInterface clearTrigger={clearChatTrigger} />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;
