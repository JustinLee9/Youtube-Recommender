import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './popup/popup.css'
import Popup from './popup/popup.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Popup />
  </StrictMode>,
)
