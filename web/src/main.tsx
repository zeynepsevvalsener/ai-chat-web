import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import ChatScreen from './pages/ChatScreen.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatScreen />
  </StrictMode>,
)
