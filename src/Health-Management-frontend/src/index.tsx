import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import CssBaseline from '@mui/material/CssBaseline';

// Simple loader fix that won't break React rendering
const loader = document.getElementById('loading');
if (loader) {
  loader.style.display = 'none';
}

// Use the standard React rendering method
ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
); 