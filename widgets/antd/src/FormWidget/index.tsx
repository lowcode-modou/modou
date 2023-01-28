import { ProForm } from '@ant-design/pro-components'
import { useMemoizedFn } from 'ahooks'
import { set } from 'lodash'
import { FC, useEffect } from 'react'

import { mcss } from '@modou/css-in-js'

import { InferWidgetState } from '../_'
import { MRSchemeFormWidgetState } from './metadata'

export const FormWidget: FC<
  InferWidgetState<typeof MRSchemeFormWidgetState>
> = ({
  readonly,
  instance,
  renderSlots,
  initialData,
  data,
  renderSlotPaths,
  updateState,
}) => {
  const [form] = ProForm.useForm<Record<string, any>>()

  const updateFormFields = useMemoizedFn((formFields: Record<string, any>) => {
    updateState((prev) => ({
      ...prev,
      data: formFields,
    }))
  })
  useEffect(() => {
    console.log('我是FormWidget 我重新渲染了', instance.widgetId)
  })
  useEffect(() => {
    updateFormFields(form.getFieldsValue())
  })
  // TODO COPY SPAN TO FORM ITEM
  return (
    <ProForm
      form={form}
      data-widget-root
      data-widget-id={instance.widgetId}
      className={classes.wrapper}
      layout="horizontal"
      readonly={readonly}
      submitter={false}
      initialValues={initialData}
      onFieldsChange={(changedFields, allFields) => {
        updateFormFields(
          allFields.reduce<Record<string, any>>((pre, cur) => {
            set(pre, cur.name, cur.value)
            return pre
          }, {}),
        )
      }}
    >
      <div
        data-widget-id={instance.widgetId}
        data-widget-slot-path={renderSlotPaths.header}
      >
        {renderSlots.header}
      </div>
      <div
        data-widget-id={instance.widgetId}
        data-widget-slot-path={renderSlotPaths.children}
      >
        {renderSlots.children}
      </div>
      <div
        data-widget-id={instance.widgetId}
        data-widget-slot-path={renderSlotPaths.footer}
      >
        {renderSlots.footer}
      </div>
    </ProForm>
  )
}

const classes = {
  wrapper: mcss`
    width: 100%;
  `,
}
