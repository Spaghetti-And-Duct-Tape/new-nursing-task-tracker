import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./main.css";
import { DateProvider } from './hooks/DateProvider';
import { AssignmentProvider } from './hooks/AssignmentProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DateProvider>
      <AssignmentProvider>
        <App />
      </AssignmentProvider>
    </DateProvider>
  </StrictMode>,
)
