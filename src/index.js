import React from 'react';
import { createRoot } from 'react-dom'; // Import createRoot
import App from './app.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
const root = createRoot(document.getElementById('root')); // Specify the root element

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
