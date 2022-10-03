import React from 'react'
import ReactDOM from 'react-dom/client'
import 'antd/dist/reset.css'
import '@/tailwindcss.scss'
import '@/styles/reset-antd.scss'
import { App } from '@/App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
