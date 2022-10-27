import { ProForm, ProFormText } from '@ant-design/pro-components'
import { Form } from 'antd'
import { FC, useContext, useEffect } from 'react'

import { DocumentContext } from '@modou/core'

import { InferWidgetState } from '../_'
import { MRSchemeInputWidgetState } from './metadata'

export const InputWidget: FC<
  InferWidgetState<typeof MRSchemeInputWidgetState>
> = ({ defaultValue, label, instance, value, updateState }) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  const documentContext = useContext(DocumentContext)
  useEffect(() => {
    const hackElement = documentContext.current.document.querySelector(
      `[data-hack-widget-id=${instance.widgetId}]`,
    )
    hackElement?.parentElement?.setAttribute(
      'data-widget-id',
      instance.widgetId,
    )
  }, [documentContext, instance.widgetId])
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
