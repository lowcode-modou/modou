import { AppSpin } from '@/components'
import { AppRouters } from '@/routers'
import { FC, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { RecoilRoot } from 'recoil'

import { ThemeProvider } from '@modou/css-in-js'

export const App: FC = () => {
  return (
    <Suspense fallback={<AppSpin />}>
      <RecoilRoot>
        <ThemeProvider>
          <Router>
            <AppRouters />
          </Router>
        </ThemeProvider>
      </RecoilRoot>
    </Suspense>
  )
}
