import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Conversations from './components/Conversations.jsx'

// Hidden logs view at /logs — the normal chat stays at the root URL
const isLogs = window.location.pathname === '/logs'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isLogs ? <Conversations /> : <App />}
  </StrictMode>,
)
