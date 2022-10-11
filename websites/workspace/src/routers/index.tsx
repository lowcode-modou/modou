import { FC } from 'react'
import { useRoutes } from 'react-router-dom'
import { lazyImport } from '@/utils/lazyImport'
import { ROUTER_PATH } from '@/constants'

const { Apps } = lazyImport(async () => await import('@/features/apps'), 'Apps')
const { App } = lazyImport(async () => await import('@/features/app'), 'App')
const { Page } = lazyImport(async () => await import('@/features/page'), 'Page')
const { Entity } = lazyImport(
  async () => await import('@/features/entity'),
  'Entity',
)

export const AppRouters: FC = () => {
  const elements = useRoutes([
    {
      path: ROUTER_PATH.APPS,
      element: <Apps />,
    },
    {
      path: ROUTER_PATH.APP,
      element: <App />,
      children: [
        {
          path: ROUTER_PATH.PAGE,
          element: <Page />,
        },
        {
          path: ROUTER_PATH.Entity,
          element: <Entity />,
        },
      ],
    },
    {
      path: '/',
      element: <Apps />,
    },
  ])
  return <>{elements}</>
}
