import React from 'react';

import './assets/css/index.css';
import Dashboard from './pages/Dashboard';
import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './assets/main.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

const root = createRoot(document.getElementById('root') as Element);
const googleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

root.render(
  <GoogleOAuthProvider clientId={googleClientID}>
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  </GoogleOAuthProvider>,
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
