import { EntityModuleActionWrapper } from '@/features/entity/components/EntityModuleActions'
import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC } from 'react'

import { Entity, EntityField } from '@modou/core'
import { mcss } from '@modou/css-in-js'

export const EntityFields: FC<{
  entity: Entity
}> = ({ entity }) => {
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
          <Button size={'small'} type={'link'}>
            编辑
          </Button>
          <Button size={'small'} type={'link'}>
            详情
          </Button>
          <Button size={'small'} danger type={'text'}>
            删除
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <>
      <EntityModuleActionWrapper>
        <Button type={'link'}>添加字段</Button>
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
const classes = {
  actions: mcss`
    //display: flex;
    text-align: right;
  `,
}
