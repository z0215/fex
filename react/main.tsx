import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'virtual:uno.css'

createRoot(document.getElementById('toys') ?? document.body).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
