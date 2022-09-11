import { FC, Suspense } from 'react'
import { Spin } from 'antd'
import { BrowserRouter as Router } from 'react-router-dom'

import { AppRouters } from '@/routers'

export const App: FC = () => {
  return (
    <Suspense fallback={<Spin size={'large'} />}>
      <Router>
        <AppRouters />
      </Router>
    </Suspense>
  )
}
