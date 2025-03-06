import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ImageToggleButton from './ImageToggleButton'

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <App />
        <ImageToggleButton/>
  </StrictMode>,
)
