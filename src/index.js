import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
// Import for unregistering, but we'll call it directly
import { unregister } from './serviceWorkerRegistration'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Unregister the service worker to remove offline functionality
unregister();
