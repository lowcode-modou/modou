import { ROUTER_PATH } from '@/constants'
import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { CopyOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useMount } from 'ahooks'
import { Layout, Menu } from 'antd'
import { runInAction } from 'mobx'
import { observer } from 'mobx-react-lite'
import { ComponentProps, FC, useCallback, useState } from 'react'
import {
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { AppFileProvider, generateId } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { AppFile } from '@modou/meta-vfs'

import { ModuleManager } from '../components'
import { AppHeader } from '../components/AppHeader'
import { AppHome } from '../components/AppHome'
import { ModuleEnum } from '../types'

const menuItems: ComponentProps<typeof Menu>['items'] = [
  {
    title: '页面',
    icon: <CopyOutlined />,
    key: ModuleEnum.Page,
  },
  {
    title: '数据模型',
    icon: <DatabaseOutlined />,
    key: ModuleEnum.Entity,
  },
]

const appFile = runInAction(() => {
  return AppFile.create({
    name: 'Mobx_demo',
    id: generateId(),
    version: '0.0.0',
  })
})

console.log(appFile.page('as'))

const _App: FC = () => {
  const params = useParams<PageRouterParamsKey | EntityRouterParamsKey>()
  const [module, setModule] = useState<ModuleEnum | ''>('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isPageModule = matchPath(ROUTER_PATH.PAGE, pathname)
  const isEntityModule =
    matchPath(ROUTER_PATH.Entity, pathname) ??
    matchPath(ROUTER_PATH.Entities, pathname)
  const updateModule = useCallback(() => {
    if (isPageModule) {
      setModule(ModuleEnum.Page)
    } else if (isEntityModule) {
      setModule(ModuleEnum.Entity)
    } else {
      setModule('')
    }
  }, [isEntityModule, isPageModule])
  useMount(updateModule)

  const [visibleModuleManger, setVisibleModuleManger] = useState(false)

  const handleClickMenuItem: ComponentProps<typeof Menu>['onClick'] = ({
    key,
  }) => {
    switch (key) {
      case ModuleEnum.Page:
        if (key === module) {
          setVisibleModuleManger((prevState) => !prevState)
        } else {
          setModule(key as ModuleEnum)
          setVisibleModuleManger(true)
        }
        break
      case ModuleEnum.Entity:
        setVisibleModuleManger(false)
        setModule(key as ModuleEnum)
        navigate(
          generateRouterPath(ROUTER_PATH.Entities, {
            appId: params.appId,
          }),
        )
        break
      default:
    }
  }

  const isAppHome = matchPath(ROUTER_PATH.APP, pathname)
  return (
    <AppFileProvider value={appFile}>
      {isAppHome ? (
        <AppHome />
      ) : (
        <Layout className={classes.layout}>
          <AppHeader />
          <Layout>
            <Layout.Sider
              className={classes.sider}
              theme="light"
              collapsedWidth={60}
              width={60}
              collapsible
              collapsed={!visibleModuleManger}
            >
              <Menu
                className={classes.menu}
                style={{ width: '60px' }}
                mode="inline"
                selectedKeys={[module]}
                onClick={handleClickMenuItem}
                items={menuItems}
              />
            </Layout.Sider>
            <Layout.Content className={classes.layoutContent}>
              <ModuleManager
                onClose={() => {
                  setVisibleModuleManger(false)
                  updateModule()
                }}
                module={module}
                visible={visibleModuleManger}
              />
              <Outlet />
            </Layout.Content>
          </Layout>
        </Layout>
      )}
    </AppFileProvider>
  )
}
export const App = observer(_App)

const classes = {
  layout: mcss`
    height: 100%;
  `,
  menu: mcss`
    height: 100%;
  `,
  layoutContent: mcss`
    position: relative;
  `,
  sider: mcss`
    z-index: 9 !important;
    position: relative !important;
    padding: 0 !important;
    font-size: 16px !important;
    .ant-layout-sider-trigger {
      display: none;
    }
    .ant-menu-item {
      //padding: 0 calc(50% - 16px / 2) !important;
      padding-left: 16px!important;
      padding-inline: 16px;
      border: 1px solid transparent !important;
      &::after {
        display: none !important;
      }
    }
    .ant-menu-item-icon {
      font-size: 16px !important;
      //line-height: 40px;
    }
  `,
}
