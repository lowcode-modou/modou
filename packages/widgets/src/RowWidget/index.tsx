import { Row } from 'antd'
import { FC, useEffect } from 'react'

import { InferWidgetState } from '../_'
import { MRSchemeRowWidgetState } from './metadata'

export const RowWidget: FC<InferWidgetState<typeof MRSchemeRowWidgetState>> = ({
  align,
  justify,
  wrap,
  instance,
  renderSlots,
  renderSlotNames,
}) => {
  useEffect(() => {
    console.log('我是Row 我重新渲染了', instance.widgetId)
  })
  return (
    <Row
      data-widget-id={instance.widgetId}
      data-widget-slot-name={renderSlotNames.children}
      align={align}
      justify={justify}
      wrap={wrap}
    >
      {renderSlots.children}
    </Row>
  )
}
