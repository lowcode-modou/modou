import { FC, useEffect } from 'react'
import { Form, Input } from 'antd'
import { InputWidgetState } from './types'

export * from './metadata'
export const InputWidget: FC<InputWidgetState> = ({
  defaultValue,
  label,
  instance,
}) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  useEffect(() => {
    const hackElement = document.querySelector(
      `[data-hack-widget-id=${instance.widgetId}]`,
    )
    hackElement?.parentElement?.setAttribute(
      'data-widget-id',
      instance.widgetId,
    )
  }, [instance.widgetId])
  return (
    <Form.Item data-hack-widget-id={instance.widgetId} label={label}>
      <Input defaultValue={defaultValue} />
    </Form.Item>
  )
}
