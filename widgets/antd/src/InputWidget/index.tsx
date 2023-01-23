import { ProFormText } from '@ant-design/pro-components'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeInputWidgetState } from './metadata'

export const InputWidget: FC<
  InferWidgetState<typeof MRSchemeInputWidgetState>
> = ({ defaultValue, label, instance, value, updateState }) => {
  useEffect(() => {
    console.log('我是Input 我重新渲染了')
  })
  return (
    <ProFormText
      name="name"
      key={instance.widgetId}
      label={label}
      formItemProps={{
        // @ts-expect-error
        'data-widget-id': instance.widgetId,
      }}
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
  )
}
