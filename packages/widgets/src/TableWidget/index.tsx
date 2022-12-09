import { ProTable, TableDropdown } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeTableWidgetState } from './metadata'
import { MOCK_TABLE_DATA } from './mock'

interface GithubIssueItem {
  url: string
  id: number
  number: number
  title: string
  labels: Array<{
    name: string
    color: string
  }>
  state: string
  comments: number
  created_at: string
  updated_at: string
  closed_at?: string
}

const columns: Array<ProColumns<GithubIssueItem>> = [
  {
    dataIndex: 'index',
    valueType: 'indexBorder',
    width: 48,
  },
  {
    title: '标题',
    dataIndex: 'title',
    copyable: true,
    ellipsis: true,
    tip: '标题过长会自动收缩',
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项为必填项',
        },
      ],
    },
  },
  {
    disable: true,
    title: '状态',
    dataIndex: 'state',
    filters: true,
    onFilter: true,
    ellipsis: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '超长'.repeat(50) },
      open: {
        text: '未解决',
        status: 'Error',
      },
      closed: {
        text: '已解决',
        status: 'Success',
        disabled: true,
      },
      processing: {
        text: '解决中',
        status: 'Processing',
      },
    },
  },
  {
    disable: true,
    title: '标签',
    dataIndex: 'labels',
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_)
    },
    render: (_, record) => record.id,
  },
  {
    title: '创建时间',
    key: 'showTime',
    dataIndex: 'created_at',
    valueType: 'date',
    sorter: true,
    hideInSearch: true,
  },
  {
    title: '创建时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
    hideInTable: true,
    search: {
      transform: (value) => {
        return {
          startTime: value[0],
          endTime: value[1],
        }
      },
    },
  },
  {
    title: '操作',
    valueType: 'option',
    key: 'option',
    render: (text, record, _, action) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id)
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
      <TableDropdown
        key="actionGroup"
        onSelect={() => {
          action?.reload().then(console.log).catch(console.error)
        }}
        menus={[
          { key: 'copy', name: '复制' },
          { key: 'delete', name: '删除' },
        ]}
      />,
    ],
  },
]

export const TableWidget: FC<
  InferWidgetState<typeof MRSchemeTableWidgetState>
> = ({ instance, renderSlots, renderSlotPaths }) => {
  useEffect(() => {
    console.log('我是Table 我重新渲染了', instance.widgetId)
  })

  return (
    <ProTable
      data-widget-id={instance.widgetId}
      data-widget-slot-path={renderSlotPaths.children}
      columns={columns}
      dataSource={MOCK_TABLE_DATA.data as any}
      search={false}
      options={false}
      rowKey={'id'}
      cardProps={{
        bodyStyle: {
          padding: 0,
        },
      }}
    />
  )
}
