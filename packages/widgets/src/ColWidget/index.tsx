import { FC, useEffect } from 'react'
import { Col } from 'antd'
import { InferWidgetState } from '../_'
import { MRSchemeColWidgetState } from './metadata'

export const ColWidget: FC<InferWidgetState<typeof MRSchemeColWidgetState>> = ({
  span,
  instance,
  renderSlots,
  renderSlotNames,
  widgetName,
}) => {
  useEffect(() => {
    console.log('我是Col 我重新渲染了', widgetName)
  })
  return (
    <Col
      data-widget-id={instance.widgetId}
      data-widget-slot-name={renderSlotNames.children}
      span={span}
    >
      {renderSlots.children}
    </Col>
  )
}
