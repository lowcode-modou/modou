import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import produce from 'immer'
import { ComponentProps, FC, useRef } from 'react'
import { useRecoilState, useSetRecoilState } from 'recoil'

import { Entity, EntityField, Metadata } from '@modou/core'

import { EntityFieldCreator } from './EntityFieldCreator'
import { EntityModuleActionWrapper } from './EntityModuleActions'

export const EntityFields: FC<{
  entityId: string
}> = ({ entityId }) => {
  const fieldCreatorRef: ComponentProps<typeof EntityFieldCreator>['ref'] =
    useRef(null)
  const [entity, setEntity] = useRecoilState(Metadata.entitySelector(entityId))

  const columns: ColumnsType<EntityField> = [
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
                entityId: entity.id,
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
                entityId: entity.id,
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
              setEntity(
                produce((draft) => {
                  draft.fields = draft.fields.filter(
                    (field) => field.id !== record.id,
                  )
                }),
              )
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
            fieldCreatorRef.current?.create({ entityId: entity.id })
          }}
        >
          添加字段
        </Button>
      </EntityModuleActionWrapper>
      <div>
        <Table<EntityField>
          size={'small'}
          dataSource={entity.fields}
          rowKey={'id'}
          columns={columns}
          pagination={false}
        />
      </div>
    </>
  )
}
// const classes = {
//   actions: mcss`
//     //display: flex;
//     text-align: right;
//   `,
// }
