import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '../src/components/ThemeChanger/Theme.jsx' // 👈 import this

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>   {/* 👈 wrap your app */}
      <App />
    </ThemeProvider>
  </StrictMode>,
)