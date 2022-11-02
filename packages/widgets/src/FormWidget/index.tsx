import { ProForm } from '@ant-design/pro-components'
import { Col } from 'antd'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeFormWidgetState } from './metadata'

export const FormWidget: FC<
  InferWidgetState<typeof MRSchemeFormWidgetState>
> = ({ readonly, instance, renderSlots, renderSlotNames }) => {
  useEffect(() => {
    console.log('我是FormWidget 我重新渲染了', instance.widgetId)
    console.log(renderSlots.children)
  })
  // TODO COPY SPAN TO FORM ITEM
  return (
    <ProForm
      data-widget-id={instance.widgetId}
      data-widget-slot-name={renderSlotNames.children}
      layout="horizontal"
      readonly={readonly}
      submitter={false}
      grid
      initialValues={{
        name: '小明',
        address: '山东省',
        school: '清华大学',
        age: 12,
      }}
    >
      {renderSlots.children?.map((child) => (
        <Col
          key={`col_${(child as unknown as { key: string })?.key}`}
          span={12}
        >
          {child}
        </Col>
      ))}
    </ProForm>
  )
}
