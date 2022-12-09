import { Col } from 'antd'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeColWidgetState } from './metadata'

export const ColWidget: FC<InferWidgetState<typeof MRSchemeColWidgetState>> = ({
  span,
  instance,
  renderSlots,
  renderSlotPaths,
}) => {
  useEffect(() => {
    console.log('我是Col 我重新渲染了', instance.widgetId)
  })
  return (
    <Col
      data-widget-id={instance.widgetId}
      data-widget-slot-path={renderSlotPaths.children}
      span={span}
    >
      {renderSlots.children}
    </Col>
  )
}
