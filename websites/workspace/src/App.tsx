import { FC, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRouters } from '@/routers'
import { AppSpin } from '@/components'

export const App: FC = () => {
  return (
    <Suspense fallback={<AppSpin />}>
      <Router>
        <AppRouters />
      </Router>
    </Suspense>
  )
}
