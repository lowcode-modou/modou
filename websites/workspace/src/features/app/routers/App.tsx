import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { CopyOutlined, DatabaseOutlined } from '@ant-design/icons'
import { Avatar, Button, Layout, Menu } from 'antd'
import produce from 'immer'
import { isEmpty } from 'lodash'
import { ComponentProps, FC, useCallback, useEffect, useState } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import { useSetRecoilState } from 'recoil'

import { Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

// import classes from './app.css'
import { ModuleManager } from '../components'
import { AppHome } from '../components/AppHome'
import { MOCK_PAGE_ID, MOCK_ROOT_WIDGET_ID, MOCK_WIDGETS } from '../mock'
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
    keyPath,
  }) => {
    if (key === module) {
      setVisibleModuleManger((prevState) => !prevState)
    } else {
      setModule(key as ModuleEnum)
      setVisibleModuleManger(true)
    }
  }

  // MOCK
  const setApp = useSetRecoilState(Metadata.appAtom)
  useEffect(() => {
    const MOCK_PAGES = [
      {
        name: '大漠孤烟直',
        id: MOCK_PAGE_ID,
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID,
      },
      {
        name: '测试',
        id: MOCK_PAGE_ID + '___',
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID,
      },
      {
        name: '长河落日圆',
        id: MOCK_PAGE_ID + '________',
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID,
      },
    ]
    setApp(
      produce((draft) => {
        if (isEmpty(draft.pages)) {
          draft.pages = MOCK_PAGES
        } else {
          return draft
        }
      }),
    )
  }, [setApp])

  return (
    <Layout className={classes.layout}>
      <Layout.Header className={classes.header}>
        <div className={classes.headerLogoWrapper}>
          <img src="/modou.svg" alt="" />
        </div>
        <div className={classes.headerRight}>
          <Button type="link" href="https://runtime.modou.ink" target="_blank">
            预览
          </Button>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
        </div>
      </Layout.Header>
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
          {Object.keys(params).length === 1 && <AppHome />}
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
  header: mcss`
    height: 48px !important;
    line-height: 48px !important;
    padding: 0 !important;
    z-index: 999999 !important;
    background-color: white !important;
    box-shadow: rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0) 0 0 0 0,
      rgba(0, 0, 0, 0.1) 0 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  headerLogoWrapper: mcss`
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 32px;
    }
  `,
  headerRight: mcss`
    padding-right: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
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
