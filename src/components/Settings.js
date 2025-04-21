import React, { useContext, useState } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import './Settings.css';
import { DEFAULT_SYSTEM_INSTRUCTION } from '../contexts/SettingsContext'; 

const POPULAR_MODELS = [
  { id: 'google/gemini-flash-1.5-8b', name: 'Gemini 1.5 Flash 8B' },
  { id: 'google/gemini-2.0-flash-001', name: 'Gemini 2.0 Flash' },
  { id: 'google/gemini-flash-1.5', name: 'Gemini 1.5 Flash' },
  { id: 'mistralai/mistral-small-3.1-24b-instruct', name: 'Mistral Small 3.1 24B' },
  { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini' },
  { id: 'google/gemini-2.5-flash-preview', name: 'Gemini 2.5 Flash Preview' },
  { id: 'deepseek/deepseek-chat-v3-0324', name: 'DeepSeek V3 0324' },
  { id: 'openai/gpt-4.1-nano', name: 'GPT-4.1 Nano' },
  { id: 'anthropic/claude-3.7-sonnet', name: 'Claude 3.7 Sonnet' },
  { id: 'openai/gpt-4o-mini-2024-07-18', name: 'GPT-4o Mini (2024-07-18)' }
];

const Settings = () => {
  const { apiKey, setApiKey, model, setModel, systemInstruction, setSystemInstruction } = useContext(SettingsContext); 
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
  
  const handleSystemInstructionChange = (e) => {
    setSystemInstruction(e.target.value);
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
      
      {/* New Section for System Instruction */}
      <div className="settings-section">
        <h3>System Instruction</h3>
        <p>Define how the AI should behave. This instruction is sent at the start of each new conversation.</p>
        <textarea
         value={systemInstruction}
         onChange={handleSystemInstructionChange}
         placeholder={DEFAULT_SYSTEM_INSTRUCTION} 
         className="settings-input" 
         rows="6" 
       />
       <p className="settings-help">
         This instruction guides the AI's responses for both text and image inputs. Clear the chat to apply changes to a new conversation.
        </p>
      </div>


      <div className="settings-info">
        <h3>About Archon</h3>
        <p>
          Archon is a language translation app that uses AI models provided through OpenRouter. Your API key is stored locally and it nor your chat history is sent to our servers.
        </p>
      </div>
    </div>
  );
};

export default Settings;
