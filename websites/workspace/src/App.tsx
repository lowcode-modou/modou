import './App.css'
import { FC, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { AppRouters } from '@/routers'

export const App: FC = () => {
  return (
    <div className="App">
      <img src="/modou.svg" style={{ height: '100px', width: '100px' }} />
      <h1>墨斗/WORKSPACE</h1>
      <Suspense>
        <Router>
          <AppRouters />
        </Router>
      </Suspense>
    </div>
  )
}
