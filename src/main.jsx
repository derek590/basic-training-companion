import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const STORAGE_VERSION = '2';
const currentVersion = localStorage.getItem('storage_version');

if (currentVersion !== STORAGE_VERSION) {
  localStorage.clear(); // or selectively remove specific keys
  localStorage.setItem('storage_version', STORAGE_VERSION);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
