import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Button } from 'antd'
import { FC } from 'react'

import { mcss } from '@modou/css-in-js'
import { EntityFileMeta } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'

import { EntityModuleActionWrapper } from './EntityModuleActions'

const _EntityBaseInfo: FC<{
  entity: EntityFileMeta
  onEditEntity: (entity: EntityFileMeta) => void
}> = ({ entity, onEditEntity }) => {
  return (
    <>
      <EntityModuleActionWrapper>
        <Button type={'link'} onClick={() => onEditEntity(entity)}>
          编辑
        </Button>
      </EntityModuleActionWrapper>
      <div className={classes.wrapper}>
        <ProForm<EntityFileMeta>
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

export const EntityBaseInfo = observer(_EntityBaseInfo)

const classes = {
  wrapper: mcss`
    padding: 16px;
  `,
}
