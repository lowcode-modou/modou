import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { FC, useEffect, useMemo } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeTableWidgetState } from './metadata'
import { MOCK_TABLE_DATA } from './mock'

export const TableWidget: FC<
  InferWidgetState<typeof MRSchemeTableWidgetState>
> = ({ instance, renderSlots, renderSlotPaths, columns, size }) => {
  useEffect(() => {
    console.log('我是Table 我重新渲染了', instance.widgetId)
  })

  const _columns: Array<ProColumns<any>> = useMemo(() => {
    return columns.map((c) => ({
      dataIndex: c.dataIndex,
      title: c.title,
      valueType: c.valueType,
    }))
  }, [columns])

  return (
    <ProTable
      size={size ?? undefined}
      data-widget-root
      data-widget-id={instance.widgetId}
      data-widget-slot-path={renderSlotPaths.children}
      columns={_columns}
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

// const classes = {}
