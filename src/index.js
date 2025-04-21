import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register the service worker for offline capabilities
serviceWorkerRegistration.register({
  onUpdate: registration => {
    // When a new version is available, show a notification
    const updateAvailable = window.confirm(
      'A new version of the app is available. Load the new version?'
    );
    if (updateAvailable) {
      window.location.reload();
    }
  }
});
