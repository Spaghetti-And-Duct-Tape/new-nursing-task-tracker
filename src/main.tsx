import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./main.css";
import { DateProvider } from './hooks/DateProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DateProvider>
      <App />
    </DateProvider>
  </StrictMode>,
)
