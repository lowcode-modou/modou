import { ProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import { isArray } from 'lodash'
import { FC, useEffect, useMemo } from 'react'

import { WidgetVariablesProvider } from '@modou/state-manager'

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
        // @ts-expect-error
        res.onCell = () => {
          return {
            'data-widget-id': instance.widgetId,
            'data-widget-slot-path': c.dataIndex,
          }
        }
        res.render = (val, record, index) => {
          return (
            <WidgetVariablesProvider value={{ i: index, currentRow: record }}>
              {Reflect.get(renderSlots, c.dataIndex)}
            </WidgetVariablesProvider>
          )
        }
      }
      if (c.mappedValue && c.buildIn) {
        // TODO 支持 v_i 和 v_ri
        res.renderText = (text, record, index) => {
          return text
        }
      }
      if (c.width > 0) {
        res.width = c.width
      } else {
        res.width = DEFAULT_COLUMN_WIDTH
      }
      return res
    })
  }, [columns, instance.widgetId, renderSlots])

  // FIXME 修改属性面板fixed需要刷新页面才会生效
  return (
    <div data-widget-root data-widget-id={instance.widgetId}>
      <ProTable
        scroll={{ x: '100%' }}
        size={size ?? undefined}
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
