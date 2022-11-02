import { ProForm, ProFormText } from '@ant-design/pro-components'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeInputWidgetState } from './metadata'

export const InputWidget: FC<
  InferWidgetState<typeof MRSchemeInputWidgetState>
> = ({ defaultValue, label, instance, value, updateState }) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  useEffect(() => {
    const hackElement = document.querySelector(
      `[data-hack-widget-id=${instance.widgetId}]`,
    )
    hackElement?.parentElement?.parentElement?.setAttribute(
      'data-widget-id',
      instance.widgetId,
    )
  }, [instance.widgetId])
  return (
    <ProForm.Item
      name="name"
      data-hack-widget-id={instance.widgetId}
      label={label}
    >
      <ProFormText
        noStyle
        fieldProps={{
          defaultValue,
          onChange: (e) => {
            console.log('onChange', e)
            updateState((prev) => ({
              ...prev,
              value: e.target.value,
            }))
          },
        }}
      />
    </ProForm.Item>
  )
}
