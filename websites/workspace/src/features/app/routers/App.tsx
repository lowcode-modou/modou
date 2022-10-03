import { ComponentProps, FC, useCallback, useEffect, useState } from 'react'
import { Layout, Avatar, Button, Menu } from 'antd'
import { Outlet, useParams } from 'react-router-dom'
import classes from './app.module.scss'
import { ModuleManager } from '../components'
import { CopyOutlined, DatabaseOutlined } from '@ant-design/icons'
import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { ModuleEnum } from '../types'

export const App: FC = () => {
  const params = useParams<PageRouterParamsKey | EntityRouterParamsKey>()
  // const navigate = useNavigate()

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

  const [visibleModuleManger, setVisibleModuleManger] = useState(true)

  const handleClickMenuItem: ComponentProps<typeof Menu>['onClick'] = ({ key, keyPath }) => {
    if (key === module) {
      setVisibleModuleManger(prevState => !prevState)
    } else {
      setModule(key as ModuleEnum)
      setVisibleModuleManger(true)
    }
    // switch (key) {
    //   case ModuleEnum.Page:
    //     navigate(generateRouterPath(ROUTER_PATH.PAGE, {
    //       appId: 'appId',
    //       pageId: 'pageId'
    //     }))
    //     break
    //   case ModuleEnum.Entity:
    //     navigate(generateRouterPath(ROUTER_PATH.Entity, {
    //       appId: 'appId',
    //       entityId: 'entityId'
    //     }))
    //     break
    //   default:
    // }
  }

  return <Layout className='h-full'>
    <Layout.Header
      className={`${classes.header} bg-white shadow-md flex justify-between items-center h-full`}>
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
        <Outlet />
      </Layout.Content>
    </Layout>
  </Layout>
}
