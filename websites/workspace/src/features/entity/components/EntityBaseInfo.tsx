import { EntityModuleActionWrapper } from '@/features/entity/components/EntityModuleActions'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Button } from 'antd'
import { FC } from 'react'

import { Entity } from '@modou/core'
import { mcss } from '@modou/css-in-js'

export const EntityBaseInfo: FC<{
  entity: Entity
  onEditEntity: (entity: Entity) => void
}> = ({ entity, onEditEntity }) => {
  return (
    <>
      <EntityModuleActionWrapper>
        <Button type={'link'} onClick={() => onEditEntity(entity)}>
          编辑
        </Button>
      </EntityModuleActionWrapper>
      <div className={classes.wrapper}>
        <ProForm<Entity>
          readonly
          layout="horizontal"
          grid
          colProps={{ span: 12 }}
          submitter={false}
        >
          <ProFormText
            label="名称"
            fieldProps={{
              value: entity.title,
            }}
          />
          <ProFormText
            label="标识"
            fieldProps={{
              value: entity.name,
            }}
          />
          <ProFormText
            label="描述"
            fieldProps={{
              value: entity.description,
            }}
          />
        </ProForm>
      </div>
    </>
  )
}

const classes = {
  wrapper: mcss`
    padding: 16px;
  `,
}
