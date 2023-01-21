import { useBoolean } from 'ahooks'
import { Form } from 'antd'

import { generateId, useAppManager } from '@modou/core'
import { EntityFile, EntityFileMeta } from '@modou/meta-vfs'

export const useEntityCreator = () => {
  const [open, { setFalse, setTrue }] = useBoolean(false)
  const [form] = Form.useForm<EntityFileMeta>()
  const { app } = useAppManager()

  const onSubmitEntity = (entity: EntityFileMeta) => {
    // 编辑
    if (entity.id) {
      app.entityMap[entity.id].updateMeta(entity)
    } else {
      const maxX = Math.max(
        ...app.entities.map((entity) => entity.meta.position.x),
      )
      EntityFile.create(
        {
          ...entity,
          id: generateId(),
          position: {
            x: maxX + 400,
            y: 100,
          },
        },
        app,
      )
    }
    setFalse()
  }
  return {
    setTrue,
    setFalse,
    onSubmitEntity,
    form,
    open,
  }
}
