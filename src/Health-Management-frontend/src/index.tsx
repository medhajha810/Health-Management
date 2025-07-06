import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import CssBaseline from '@mui/material/CssBaseline';
import './fclConfig';

// Simple loader fix that won't break React rendering
const loader = document.getElementById('loading');
if (loader) {
  loader.style.display = 'none';
}

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <CssBaseline />
      <App />
    </React.StrictMode>
  );
} 