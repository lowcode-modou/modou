import { ROUTER_PATH } from '@/constants'
import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { CopyOutlined, DatabaseOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { ComponentProps, FC, useCallback, useEffect, useState } from 'react'
import {
  Outlet,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import { mcss } from '@modou/css-in-js'

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

export const App: FC = () => {
  const params = useParams<PageRouterParamsKey | EntityRouterParamsKey>()
  const [module, setModule] = useState<ModuleEnum | ''>('')
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const updateModule = useCallback(() => {
    if (params.pageId) {
      setModule(ModuleEnum.Page)
    } else if (params.entityId) {
      setModule(ModuleEnum.Entity)
    } else {
      setModule('')
    }
  }, [params])
  useEffect(() => {
    updateModule()
  }, [updateModule])

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
  return isAppHome ? (
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
  )
}

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
    z-index: 2000 !important;
    position: relative !important;
    padding: 0 !important;
    font-size: 16px !important;
    .ant-layout-sider-trigger {
      display: none;
    }
    .ant-menu-item {
      padding: 0 calc(50% - 16px / 2) !important;
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
