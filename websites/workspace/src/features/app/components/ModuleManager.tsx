import { ComponentProps, FC, useEffect, useRef, useState } from 'react'
import { Drawer, Input } from 'antd'
import { ModuleEnum } from '../types'
import { match } from 'ts-pattern'
import { ModuleManagerPage } from './ModuleManagerPage'
import { ModuleManagerEntity } from './ModuleManagerEntity'

export const ModuleManager: FC<{
  visible: boolean
  module: ModuleEnum | ''
  onClose?: (ComponentProps<typeof Drawer>)['onClose']
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

  return <div className='absolute inset-0'>
    <Drawer
      title={<div>
        <div
          className='flex justify-between items-center'
          style={{ paddingBottom: '16px' }}>
          <span>{moduleTitle}</span>
          <span ref={moduleItemAddElementRef} />
        </div>
        <Input
          onChange={(e) => setSearchVal(e.target.value)}
          value={searchVal}
          allowClear
          placeholder='搜索' />
      </div>}
      headerStyle={{
        padding: '16px'
      }}
      bodyStyle={{
        padding: '16px'
      }}
      className='absolute'
      placement='left'
      width={288}
      maskClosable
      closable={false}
      getContainer={false}
      onClose={onClose}
      open={visible}>
      {
        module === ModuleEnum.Page &&
          <ModuleManagerPage itemAddRef={moduleItemAddElementRef.current} searchVal={searchVal} />
      }
      {
        module === ModuleEnum.Entity &&
          <ModuleManagerEntity itemAddRef={moduleItemAddElementRef.current} searchVal={searchVal} />
      }
    </Drawer>
  </div>
}
