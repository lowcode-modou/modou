import { FC, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AppRouters } from '@/routers'
import { AppSpin } from '@/components'
import { RecoilRoot } from 'recoil'

export const App: FC = () => {
  return (
    <Suspense fallback={<AppSpin />}>
      <RecoilRoot>
        <Router>
          <AppRouters />
        </Router>
      </RecoilRoot>
    </Suspense>
  )
}
