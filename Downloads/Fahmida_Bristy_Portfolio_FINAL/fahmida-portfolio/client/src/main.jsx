import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { MuiProvider } from './lib/muiTheme.jsx'
import { AuthProvider } from './lib/auth.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MuiProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MuiProvider>
  </StrictMode>,
)
