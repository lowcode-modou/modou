import { Form, Input } from 'antd'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeInputWidgetState } from './metadata'

export const InputWidget: FC<
  InferWidgetState<typeof MRSchemeInputWidgetState>
> = ({ defaultValue, label, instance, value, updateState }) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  // useEffect(() => {
  //   const hackElement = document.querySelector(
  //     `[data-hack-widget-id=${instance.widgetId}]`,
  //   )
  //   hackElement?.parentElement?.setAttribute(
  //     'data-widget-id',
  //     instance.widgetId,
  //   )
  // }, [instance.widgetId])
  return (
    <Form.Item data-widget-id={instance.widgetId} label={label}>
      <Input
        defaultValue={defaultValue}
        value={value}
        onChange={(e) => {
          updateState((prev) => ({
            ...prev,
            value: e.target.value,
          }))
        }}
      />
    </Form.Item>
  )
}
