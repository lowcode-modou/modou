import { ComponentProps, FC } from 'react'
import { Drawer } from 'antd'
import { useParams } from 'react-router-dom'
import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { ModuleEnum } from '../types'
import { match } from 'ts-pattern'

export const ModuleManager: FC<{
  visible: boolean
  module: ModuleEnum | ''
  onClose?: (ComponentProps<typeof Drawer>)['onClose']
}> = ({ visible, module, onClose }) => {
  const params = useParams<PageRouterParamsKey | EntityRouterParamsKey>()
  const moduleTitle = match(module)
    .with(ModuleEnum.Page, () => '页面')
    .with(ModuleEnum.Entity, () => '数据模型')
    .otherwise(() => '')
  return <div className='absolute inset-0'>
    <Drawer
      title={moduleTitle}
      className='absolute'
      placement='left'
      width={288}
      maskClosable
      closable={false}
      getContainer={false}
      onClose={onClose}
      visible={visible}>
    </Drawer>
  </div>
}
