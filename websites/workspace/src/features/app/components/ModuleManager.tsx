import { Drawer, Input } from 'antd'
import { ComponentProps, FC, useEffect, useRef, useState } from 'react'
import { match } from 'ts-pattern'

import { mcss } from '@modou/css-in-js'

import { ModuleEnum } from '../types'
import { ModuleManagerEntity } from './ModuleManagerEntity'
import { ModuleManagerPage } from './ModuleManagerPage'

export const ModuleManager: FC<{
  visible: boolean
  module: ModuleEnum | ''
  onClose?: ComponentProps<typeof Drawer>['onClose']
}> = ({ visible, module, onClose }) => {
  // const params = useParams<PageRouterParamsKey | EntityRouterParamsKey>()
  const moduleTitle = match(module)
    .with(ModuleEnum.Page, () => '页面')
    .with(ModuleEnum.Entity, () => '数据模型')
    .otherwise(() => '')

  useEffect(() => {
    setSearchVal('')
  }, [module])

  const [searchVal, setSearchVal] = useState<string>('')

  const moduleItemAddElementRef = useRef<HTMLElement>(null)

  return (
    <div className={classes.drawerWrapper}>
      <Drawer
        title={
          <div>
            <div className={classes.drawerTitleWrapper}>
              <span>{moduleTitle}</span>
              <span ref={moduleItemAddElementRef} />
            </div>
            <Input
              onChange={(e) => setSearchVal(e.target.value)}
              value={searchVal}
              allowClear
              placeholder="搜索"
            />
          </div>
        }
        headerStyle={{
          padding: '16px',
        }}
        bodyStyle={{
          padding: '16px',
        }}
        className={classes.drawer}
        placement="left"
        width={288}
        maskClosable
        closable={false}
        getContainer={false}
        onClose={onClose}
        open={visible}
      >
        {module === ModuleEnum.Page && (
          <ModuleManagerPage
            itemAddRef={moduleItemAddElementRef.current}
            searchVal={searchVal}
          />
        )}
        {module === ModuleEnum.Entity && (
          <ModuleManagerEntity
            itemAddRef={moduleItemAddElementRef.current}
            searchVal={searchVal}
          />
        )}
      </Drawer>
    </div>
  )
}

const classes = {
  drawerWrapper: mcss`
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `,
  drawerTitleWrapper: mcss`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
  `,
  drawer: mcss`
    position: absolute;
  `,
}
