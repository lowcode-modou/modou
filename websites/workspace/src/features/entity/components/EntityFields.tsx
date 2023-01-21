import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { ComponentProps, FC, useRef } from 'react'

import { useAppManager } from '@modou/core'
import { EntityFieldFileMeta } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'

import { EntityFieldCreator } from './EntityFieldCreator'
import { EntityModuleActionWrapper } from './EntityModuleActions'

const _EntityFields: FC<{
  entityId: string
}> = ({ entityId }) => {
  const fieldCreatorRef: ComponentProps<typeof EntityFieldCreator>['ref'] =
    useRef(null)

  const { app } = useAppManager()
  const entity = app.entityMap[entityId]!

  const columns: ColumnsType<EntityFieldFileMeta> = [
    {
      title: '名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '标识',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            size={'small'}
            type={'link'}
            onClick={() => {
              fieldCreatorRef.current?.edit({
                entityId: entity.meta.id,
                fieldId: record.id,
              })
            }}
          >
            编辑
          </Button>
          <Button
            size={'small'}
            type={'link'}
            onClick={() => {
              fieldCreatorRef.current?.showDetail({
                entityId: entity.meta.id,
                fieldId: record.id,
              })
            }}
          >
            详情
          </Button>
          <Button
            size={'small'}
            danger
            type={'text'}
            onClick={() => {
              entity.deleteEntityField(record.id)
            }}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <>
      <EntityFieldCreator ref={fieldCreatorRef} />
      <EntityModuleActionWrapper>
        <Button
          type={'link'}
          onClick={() => {
            fieldCreatorRef.current?.create({ entityId: entity.meta.id })
          }}
        >
          添加字段
        </Button>
      </EntityModuleActionWrapper>
      <div>
        <Table<EntityFieldFileMeta>
          size={'small'}
          dataSource={entity.entityFields.map((field) => field.meta)}
          rowKey={'id'}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  )
}

export const EntityFields = observer(_EntityFields)
// const classes = {
//   actions: mcss`
//     //display: flex;
//     text-align: right;
//   `,
// }
