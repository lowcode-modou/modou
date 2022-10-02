import { ComponentProps, FC } from 'react'
import { Drawer } from 'antd'
import { useParams } from 'react-router-dom'
import { EntityRouterParamsKey, PageRouterParamsKey } from '@/types'
import { ModuleEnum } from '../types'

export const ModuleManager: FC<{
  visible: boolean
  module: ModuleEnum
  onClose?: (ComponentProps<typeof Drawer>)['onClose']
}> = ({ visible, module, onClose }) => {
  const params = useParams<PageRouterParamsKey | EntityRouterParamsKey>()
  return <div className='absolute inset-0'>
    <Drawer
      className='absolute'
      placement='left'
      maskClosable
      closable={false}
      getContainer={false}
      onClose={onClose}
      visible={visible}>
      {module}-
      {JSON.stringify(params)}
    </Drawer>
  </div>
}
