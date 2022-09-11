import { FC } from 'react'
import { useRoutes } from 'react-router-dom'
import { lazyImport } from '@/utils/lazyImport'

const { Apps } = lazyImport(async () => await import('@/features/apps'), 'Apps')
const { Page } = lazyImport(async () => await import('@/features/page'), 'Page')

export const AppRouters: FC = () => {
  const elements = useRoutes([
    {
      path: '/apps',
      element: <Apps />
    },
    {
      path: '/page',
      element: <Page />
    }, {
      path: '/',
      element: <Apps />
    }
  ])
  return <>{elements}</>
}
