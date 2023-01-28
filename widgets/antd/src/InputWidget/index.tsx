import { ProFormText } from '@ant-design/pro-components'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeInputWidgetState } from './metadata'

export const InputWidget: FC<
  InferWidgetState<typeof MRSchemeInputWidgetState>
> = ({ defaultValue, label, instance, name, updateState }) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  return (
    <ProFormText
      name={name}
      key={instance.widgetId}
      label={label}
      formItemProps={{
        // @ts-expect-error
        'data-widget-id': instance.widgetId,
        'data-widget-root': true,
      }}
      fieldProps={{
        defaultValue,
        onChange: (e) => {
          // TODO 执行流的时候监听表单值的变化替代onChange
          updateState((prev) => ({
            ...prev,
            value: e.target.value,
          }))
        },
      }}
    />
  )
}
