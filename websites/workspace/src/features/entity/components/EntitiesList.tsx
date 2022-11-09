import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { Entity, Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

const columns: ColumnsType<Entity> = [
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
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
        <Button size={'small'} danger type={'text'}>
          删除
        </Button>
      </Space>
    ),
  },
]
export const EntitiesList: FC = () => {
  const entities = useRecoilValue(Metadata.entitiesSelector)

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
    padding: 24px;
  `,
}
