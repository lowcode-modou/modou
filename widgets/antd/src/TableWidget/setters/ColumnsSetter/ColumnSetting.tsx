import { Form, Input, Tooltip } from 'antd'
import produce from 'immer'
import { FC, ReactElement } from 'react'

import { TableWidgetColumn } from './types'

export const ColumnSetting: FC<{
  children: ReactElement
  value: TableWidgetColumn
  onChange: (value: TableWidgetColumn) => void
}> = ({ children, value, onChange }) => {
  return (
    <Tooltip
      color="white"
      placement="left"
      trigger="click"
      destroyTooltipOnHide={true}
      title={
        value ? (
          <Form layout={'vertical'} size="small">
            <Form.Item label="列标题">
              <Input
                value={value.title}
                onChange={(e) =>
                  onChange(
                    produce(value, (draft) => {
                      draft.title = e.target.value
                    }),
                  )
                }
              />
            </Form.Item>
          </Form>
        ) : (
          <div>12123</div>
        )
      }
    >
      {children}
    </Tooltip>
  )
}
