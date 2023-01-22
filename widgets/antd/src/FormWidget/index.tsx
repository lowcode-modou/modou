import { ProForm } from '@ant-design/pro-components'
import { Col } from 'antd'
import { FC, useEffect } from 'react'

import { mcss } from '@modou/css-in-js'

import { InferWidgetState } from '../_'
import { MRSchemeFormWidgetState } from './metadata'

export const FormWidget: FC<
  InferWidgetState<typeof MRSchemeFormWidgetState>
> = ({ readonly, instance, renderSlots, renderSlotPaths }) => {
  useEffect(() => {
    console.log('我是FormWidget 我重新渲染了', instance.widgetId)
    console.log(renderSlots.children)
  })
  // TODO COPY SPAN TO FORM ITEM
  return (
    <ProForm
      data-widget-root
      data-widget-id={instance.widgetId}
      data-w
      className={classes.wrapper}
      layout="horizontal"
      readonly={readonly}
      submitter={false}
      initialValues={{
        name: '小明',
        address: '山东省',
        school: '清华大学',
        age: 12,
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
        {renderSlots.children?.map((child) => (
          <Col
            key={`col_${(child as unknown as { key: string })?.key}`}
            span={12}
          >
            {child}
          </Col>
        ))}
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
