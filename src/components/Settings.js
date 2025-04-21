import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import './Settings.css';

const POPULAR_MODELS = [
  { id: 'anthropic/claude-3-opus-20240229', name: 'Claude 3 Opus' },
  { id: 'anthropic/claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
  { id: 'anthropic/claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
  { id: 'google/gemini-pro', name: 'Gemini Pro' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  { id: 'mistralai/mistral-large-latest', name: 'Mistral Large' },
  { id: 'mistralai/mistral-7b-instruct', name: 'Mistral 7B' }
];

const Settings = () => {
  const { apiKey, setApiKey, model, setModel } = useContext(SettingsContext);
  const [customModel, setCustomModel] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const handleApiKeyChange = (e) => {
    setApiKey(e.target.value);
  };
  
  const handleModelChange = (e) => {
    const selectedModel = e.target.value;
    if (selectedModel === 'custom') {
      setShowCustomInput(true);
    } else {
      setShowCustomInput(false);
      setModel(selectedModel);
    }
  };
  
  const handleCustomModelChange = (e) => {
    setCustomModel(e.target.value);
  };
  
  const handleCustomModelSubmit = () => {
    if (customModel.trim()) {
      setModel(customModel.trim());
      setShowCustomInput(false);
    }
  };
  
  return (
    <div className="settings-container">
      <h2>Settings</h2>
      
      <div className="settings-section">
        <h3>OpenRouter API Key</h3>
        <p>Enter your OpenRouter API key to use the translation service.</p>
        <input
          type="password"
          value={apiKey}
          onChange={handleApiKeyChange}
          placeholder="Enter your OpenRouter API key"
          className="settings-input"
        />
        <p className="settings-help">
          Don't have an API key? <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer">Get one from OpenRouter</a>
        </p>
      </div>
      
      <div className="settings-section">
        <h3>Model Selection</h3>
        <p>Choose which AI model to use for translations.</p>
        <select 
          value={POPULAR_MODELS.some(m => m.id === model) ? model : 'custom'} 
          onChange={handleModelChange}
          className="settings-select"
        >
          {POPULAR_MODELS.map(m => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
          <option value="custom">Custom Model</option>
        </select>
        
        {showCustomInput && (
          <div className="custom-model-input">
            <input
              type="text"
              value={customModel}
              onChange={handleCustomModelChange}
              placeholder="Enter model identifier (e.g., anthropic/claude-3-opus-20240229)"
              className="settings-input"
            />
            <button onClick={handleCustomModelSubmit} className="settings-button">
              Set Custom Model
            </button>
          </div>
        )}
        
        <p className="settings-help">
          Current model: <code>{model}</code>
        </p>
      </div>
      
      <div className="settings-info">
        <h3>About This App</h3>
        <p>
          This app uses AI models through OpenRouter to provide translation services.
          Your API key is stored locally on your device and is never sent to our servers.
        </p>
      </div>
    </div>
  );
};

export default Settings;
