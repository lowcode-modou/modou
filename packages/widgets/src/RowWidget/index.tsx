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
  renderSlotPaths,
}) => {
  useEffect(() => {
    console.log('我是Row 我重新渲染了', instance.id)
  })
  return (
    <Row
      data-widget-id={instance.id}
      data-widget-slot-path={renderSlotPaths.children}
      align={align}
      justify={justify}
      wrap={wrap}
    >
      {renderSlots.children}
    </Row>
  )
}
