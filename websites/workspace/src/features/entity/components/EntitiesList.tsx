import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { Entity, Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

export const EntitiesList: FC<{
  onChangeEntity: (entity: Entity) => void
  onDeleteEntity: (entityId: string) => void
}> = ({ onChangeEntity, onDeleteEntity }) => {
  const entities = useRecoilValue(Metadata.entitiesSelector)
  const columns: ColumnsType<Entity> = [
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
            onClick={() => onChangeEntity(record)}
          >
            编辑
          </Button>
          <Button
            size={'small'}
            danger
            type={'text'}
            onClick={() => onDeleteEntity(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <div className={classes.wrapper}>
      <Table<Entity>
        rowKey={'id'}
        size={'small'}
        columns={columns}
        dataSource={entities}
      />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    //padding: 24px;
  `,
}
