import { ComponentProps, FC, useCallback, useEffect, useState } from 'react'
import { Layout, Avatar, Button, Menu } from 'antd'
import { Outlet, useParams } from 'react-router-dom'
import classes from './app.module.scss'
import { ModuleManager } from '../components'
import { CopyOutlined, DatabaseOutlined } from '@ant-design/icons'
import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { ModuleEnum } from '../types'
import { AppHome } from '../components/AppHome'
import { isEmpty } from 'lodash'
import { MOCK_PAGE_ID, MOCK_ROOT_WIDGET_ID, MOCK_WIDGETS } from '../mock'
import { useSetRecoilState } from 'recoil'
import { Metadata } from '@modou/core'
import produce from 'immer'

const menuItems: ComponentProps<typeof Menu>['items'] = [
  {
    title: '页面',
    icon: <CopyOutlined />,
    key: ModuleEnum.Page
  },
  {
    title: '数据模型',
    icon: <DatabaseOutlined />,
    key: ModuleEnum.Entity
  }
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

  const handleClickMenuItem: ComponentProps<typeof Menu>['onClick'] = ({ key, keyPath }) => {
    if (key === module) {
      setVisibleModuleManger(prevState => !prevState)
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
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      },
      {
        name: '测试',
        id: MOCK_PAGE_ID + '___',
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      },
      {
        name: '长河落日圆',
        id: MOCK_PAGE_ID + '________',
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      }
    ]
    setApp(produce(draft => {
      if (isEmpty(draft.pages)) {
        draft.pages = MOCK_PAGES
      } else {
        return draft
      }
    }))
  }, [setApp])

  return <Layout className='h-full'>
    <Layout.Header
      className={`${classes.header} !bg-white shadow-md flex justify-between items-center`}>
      <div className={classes.headerLogoWrapper}>
        <img
          src='/modou.svg' alt='' />
      </div>
      <div className={`flex justify-end items-center ${classes.headerRight}`}>
        <Button type='link' href='https://runtime.modou.ink' target='_blank'>预览</Button>
        <Avatar src='https://joeschmoe.io/api/v1/random' />
      </div>
    </Layout.Header>
    <Layout>
      <Layout.Sider
        className={classes.sider}
        theme='light'
        collapsedWidth={60}
        width={60}
        collapsible
        collapsed={!visibleModuleManger}>
        <Menu
          className="h-full"
          style={{ width: '60px' }}
          mode='inline'
          selectedKeys={[module]}
          onClick={handleClickMenuItem}
          items={menuItems} />
      </Layout.Sider>
      <Layout.Content className='relative'>
        <ModuleManager
          onClose={() => {
            setVisibleModuleManger(false)
            updateModule()
          }}
          module={module}
          visible={visibleModuleManger}/>
        {Object.keys(params).length === 1 && <AppHome/>}
        <Outlet />
      </Layout.Content>
    </Layout>
  </Layout>
}
