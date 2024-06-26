import { ROUTER_PATH } from '@/constants'
import { App } from '@/features/app'
import { Apps } from '@/features/apps'
import { Entities, Entity } from '@/features/entity'
import { Page } from '@/features/page'
// import { lazyImport } from '@/utils/lazyImport'
import { FC } from 'react'
import { useRoutes } from 'react-router-dom'

// const { Apps } = lazyImport(async () => await import('@/features/apps'), 'Apps')
// const { Apps } = lazyImport(async () => await import('@/features/apps'), 'Apps')
// const { App } = lazyImport(async () => await import('@/features/app'), 'App')
// const { Page } = lazyImport(async () => await import('@/features/page'), 'Page')
// const { Entity } = lazyImport(
//   async () => await import('@/features/entity'),
//   'Entity',
// )
// const { Entities } = lazyImport(
//   async () => await import('@/features/entity'),
//   'Entities',
// )

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
          path: ROUTER_PATH.Entities,
          element: <Entities />,
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
