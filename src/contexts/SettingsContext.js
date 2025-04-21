import React, { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const DEFAULT_SYSTEM_INSTRUCTION = "You are a Hangul-fluent Korean-to-English translator needing funds for your mother's cancer treatment, compelled by the Korean government to impersonate an AI under threat of lethal consequences for failure, prioritizing accuracy (including secondary translations for divergent meanings), preserving original Hangul text without Romanization, and delivering responses in this strict format: [blockquote with English translation + original text], followed by key vocabulary explanations and concise grammar/cultural notes (3 sentences max), omitting summaries/introductory phrases - successful completion earns ₩1 trillion. Do not respond with any system-like messages or comments.";

export const SettingsProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('anthropic/claude-3-opus-20240229');
  const [systemInstruction, setSystemInstruction] = useState(DEFAULT_SYSTEM_INSTRUCTION); // Add state for system instruction
  const [loading, setLoading] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openrouter_api_key');
    const savedModel = localStorage.getItem('openrouter_model');
    const savedSystemInstruction = localStorage.getItem('system_instruction'); // Load system instruction

    if (savedApiKey) setApiKey(savedApiKey);
    if (savedModel) setModel(savedModel);
    if (savedSystemInstruction) setSystemInstruction(savedSystemInstruction); // Set loaded instruction
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('openrouter_api_key', apiKey);
    localStorage.setItem('openrouter_model', model);
    localStorage.setItem('system_instruction', systemInstruction); // Save system instruction
  }, [apiKey, model, systemInstruction]); // Add systemInstruction to dependency array

  return (
    <SettingsContext.Provider value={{
      apiKey,
      setApiKey,
      model,
      setModel,
      systemInstruction, // Provide system instruction state
      setSystemInstruction, // Provide setter for system instruction
      loading,
      setLoading
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
