import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ThirdwebProvider } from 'thirdweb/react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThirdwebProvider>
    <App />
    </ThirdwebProvider>
  </StrictMode>,
)
