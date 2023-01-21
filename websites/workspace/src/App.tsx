import { AppSpin } from '@/components'
import { AppRouters } from '@/routers'
import { ConfigProvider, Watermark } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { FC, Suspense } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'

import { ThemeProvider } from '@modou/css-in-js'

export const App: FC = () => {
  return (
    <Suspense fallback={<AppSpin />}>
      <ConfigProvider locale={zhCN}>
        <ThemeProvider>
          <Router>
            <Watermark
              content="Celebrating Lunar New Year"
              style={{ height: '100%' }}
              zIndex={9999999}
              font={{ color: '#aa381e' }}
            >
              <AppRouters />
            </Watermark>
          </Router>
        </ThemeProvider>
      </ConfigProvider>
    </Suspense>
  )
}
