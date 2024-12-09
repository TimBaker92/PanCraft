// src/renderer.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createTheme, MantineProvider } from '@mantine/core';
import App from './App.jsx';
import '@mantine/core/styles.css';

const theme = createTheme({
  fontFamily: 'Segoe UI, sans-serif',
  fontFamilyMonospace: 'Consolas, monospace', // Optional for monospaced components
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <MantineProvider theme={theme} defaultColorScheme="dark">
    <App />
  </MantineProvider>
);
