import { FC, useEffect } from 'react'
import { Col } from 'antd'
import { ColWidgetState } from './types'

export * from './metadata'
export const ColWidget: FC<ColWidgetState> = ({
  span,
  instance,
  renderSlots,
  renderSlotNames
}) => {
  useEffect(() => {
    console.log('我是Col 我重新渲染了')
  })
  return <Col
    data-widget-id={instance.widgetId}
    data-widget-slot-name={renderSlotNames.children}
    span={span}
  >{renderSlots.children}</Col>
}
