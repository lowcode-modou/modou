import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { FC, useEffect, useMemo } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeTableWidgetState } from './metadata'
import { MOCK_TABLE_DATA } from './mock'

const DEFAULT_COLUMN_WIDTH = 150

export const TableWidget: FC<
  InferWidgetState<typeof MRSchemeTableWidgetState>
> = ({ instance, renderSlots, renderSlotPaths, columns, size }) => {
  useEffect(() => {
    console.log('我是Table 我重新渲染了', instance.widgetId)
  })

  const _columns: Array<ProColumns<any>> = useMemo(() => {
    return columns.map((c, index) => {
      const res: ProColumns<any> = {
        dataIndex: c.dataIndex,
        title: c.title,
        valueType: c.valueType,
        align: c.align,
        fixed: c.fixed ? c.fixed : false,
        renderText: () => c.mappedValue,
      }
      if (c.width > 0) {
        res.width = c.width
      } else {
        c.width = DEFAULT_COLUMN_WIDTH
      }
      return res
    })
  }, [columns])

  console.log('MOCK_TABLE_DATA.data', MOCK_TABLE_DATA.data)

  // FIXME 修改属性面板fixed需要刷新页面才会生效
  return (
    <ProTable
      scroll={{ x: 1 }}
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
