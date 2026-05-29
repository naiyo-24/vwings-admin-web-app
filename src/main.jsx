import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

window.addEventListener('error', (event) => {
  document.body.innerHTML = '<div style="color:red; background:white; padding:20px; z-index:99999; position:absolute; top:0; left:0;">' + event.error.message + '<br/><pre>' + event.error.stack + '</pre></div>';
});
window.addEventListener('unhandledrejection', (event) => {
  document.body.innerHTML = '<div style="color:red; background:white; padding:20px; z-index:99999; position:absolute; top:0; left:0;">Unhandled Promise Rejection:<br/>' + event.reason + '</div>';
});

