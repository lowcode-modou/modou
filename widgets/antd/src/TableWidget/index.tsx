import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { isArray } from 'lodash'
import { FC, useEffect, useMemo } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeTableWidgetState } from './metadata'

const DEFAULT_COLUMN_WIDTH = 150

// TODO 实现 self 和 currentRow
export const TableWidget: FC<
  InferWidgetState<typeof MRSchemeTableWidgetState>
> = ({ instance, renderSlots, renderSlotPaths, columns, size, dataSource }) => {
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
        hideInTable: c.hideInTable,
        // TODO ellipsis
        // ellipsis: true,
      }
      if (!c.buildIn) {
        res.render = (val, record, index) => {
          return (
            <div
              data-widget-id={instance.widgetId}
              data-widget-slot-path={renderSlotPaths.custom_column_1}
            >
              {renderSlots.custom_column_1}
            </div>
          )
        }
      }
      if (c.mappedValue && c.buildIn) {
        res.renderText = (text, record, index) => {
          return c.mappedValue
        }
      }
      if (c.width > 0) {
        res.width = c.width
      } else {
        res.width = DEFAULT_COLUMN_WIDTH
      }
      return res
    })
  }, [columns, instance.widgetId, renderSlotPaths.custom_column_1])

  // FIXME 修改属性面板fixed需要刷新页面才会生效
  return (
    <div>
      <ProTable
        scroll={{ x: '100%' }}
        size={size ?? undefined}
        data-widget-root
        data-widget-id={instance.widgetId}
        columns={_columns}
        dataSource={isArray(dataSource) ? dataSource : []}
        search={false}
        options={false}
        rowKey={(record) => record.id || Math.random()}
        cardProps={{
          bodyStyle: {
            padding: 0,
          },
        }}
      />
    </div>
  )
}

// const classes = {}
