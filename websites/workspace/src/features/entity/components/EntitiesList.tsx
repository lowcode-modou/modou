import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { FC } from 'react'

import { mcss } from '@modou/css-in-js'
import { EntityFileMeta, useAppManager } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'

const _EntitiesList: FC<{
  onClickEditEntity: (entityId: string) => void
}> = ({ onClickEditEntity }) => {
  const { app } = useAppManager()
  const columns: ColumnsType<EntityFileMeta> = [
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
            onClick={() => onClickEditEntity(record.id)}
          >
            编辑
          </Button>
          <Button
            size={'small'}
            danger
            type={'text'}
            onClick={() => app.deleteEntity(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]
  return (
    <div className={classes.wrapper}>
      <Table<EntityFileMeta>
        rowKey={'id'}
        size={'small'}
        columns={columns}
        dataSource={app.entities.map((entity) => entity.meta)}
      />
    </div>
  )
}

export const EntitiesList = observer(_EntitiesList)

const classes = {
  wrapper: mcss`
    //padding: 24px;
  `,
}
