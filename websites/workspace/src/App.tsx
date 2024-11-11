import { AppSpin } from '@/components'
import { AppRouters } from '@/routers'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { FC, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { ThemeProvider } from '@modou/css-in-js'

export const App: FC = () => {
  return (
    <Suspense fallback={<AppSpin />}>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider>
          <Router
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            <AppRouters />
          </Router>
        </ThemeProvider>
      </ConfigProvider>
    </Suspense>
  )
}
