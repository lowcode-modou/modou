import { useBoolean } from 'ahooks'
import { Form } from 'antd'
import produce from 'immer'
import { useSetRecoilState } from 'recoil'

import { AppFactory, Entity, Metadata } from '@modou/core'

export const useEntityCreator = () => {
  const setEntityById = useSetRecoilState(Metadata.entityByIdSelector)
  const [open, { setFalse, setTrue }] = useBoolean(false)
  const [form] = Form.useForm<Entity>()

  const onSubmitEntity = (entity: Entity) => {
    setEntityById(
      produce((draft) => {
        if (Reflect.has(draft, entity.id)) {
          // 编辑
          draft[entity.id] = {
            ...draft[entity.id],
            ...entity,
          }
        } else {
          // 新建
          const newEntity = AppFactory.generateDefaultEntity(entity)
          const maxX = Math.max(
            ...Object.values(draft).map((entity) => entity.position.x),
          )
          draft[newEntity.id] = {
            ...newEntity,
            position: {
              x: maxX + 400,
              y: 100,
            },
          }
        }
      }),
    )
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
