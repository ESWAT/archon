import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('anthropic/claude-3-opus-20240229');
  const [loading, setLoading] = useState(false);
  
  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key');
    const savedModel = localStorage.getItem('openrouter_model');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
  }, []);
  
  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('openrouter_api_key', apiKey);
    localStorage.setItem('openrouter_model', model);
  }, [apiKey, model]);
  
  return (
    <SettingsContext.Provider value={{ 
      apiKey, 
      setApiKey, 
      model, 
      setModel,
      loading,
      setLoading
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
