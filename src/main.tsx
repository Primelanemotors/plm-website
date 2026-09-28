import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')

if (!root) {
  throw new Error('PLM Shell: #root element was not found')
}

window.addEventListener('error', (event) => {
  console.error('[PLM Runtime Error]', event.error || event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('[PLM Unhandled Promise]', event.reason)
})

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
