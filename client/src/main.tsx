import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

if (!clientId) {
    console.error("Google Client ID is missing! Please check your .env file.");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        {/* <GoogleOAuthProvider clientId={clientId || ''}> */}
        <App />
        {/* </GoogleOAuthProvider> */}
    </React.StrictMode>,
)
