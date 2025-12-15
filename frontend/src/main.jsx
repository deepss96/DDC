import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TranslationProvider } from './services/translationService.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './assets/CSS/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TranslationProvider>
      <App />
      <ToastContainer />
    </TranslationProvider>
  </React.StrictMode>,
)
