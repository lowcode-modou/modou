import '@/styles/index.css'
import 'antd/dist/reset.css'
import React from 'react'
import ReactDOM from 'react-dom/client'

import { CanvasDesignerReactRender } from '@modou/canvas-designer'

ReactDOM.createRoot(
  document.getElementById('simulator_pc_root') as HTMLElement,
).render(
  <React.StrictMode>
    <CanvasDesignerReactRender />
  </React.StrictMode>,
)
