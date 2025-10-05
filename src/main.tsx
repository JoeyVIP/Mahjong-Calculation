import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import TestPage from './pages/TestPage.tsx'

// 檢查URL參數，決定顯示哪個頁面
const urlParams = new URLSearchParams(window.location.search);
const isTestMode = urlParams.get('test') === 'true';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isTestMode ? <TestPage /> : <App />}
  </StrictMode>,
)
