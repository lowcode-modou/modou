import { FC, memo } from 'react'
import { Col, Row, Typography } from 'antd'
import { useWidgetDrop } from '../hooks'

const WidgetDrop: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const {
    style,
    showIndicator,
    widget
  } = useWidgetDrop(widgetId)
  return showIndicator
    ? <Row
      justify='center'
      align='middle'
      className='border-dashed border-1 border-gray-300 fixed pointer-events-none'
      style={style}>
      <Col>
        <Typography.Text type={'secondary'} strong>{widget.widgetType}</Typography.Text>
      </Col>
    </Row>
    : null
}

const MemoWidgetDrop = memo(WidgetDrop)

export const WidgetDropHack: FC<{
  dropWidgetIds: string[]
}> = ({ dropWidgetIds }) => {
  // TODO use Memo 优化性能
  return <>{
    dropWidgetIds.map((widgetId) => <MemoWidgetDrop key={widgetId} widgetId={widgetId} />)
  }</>
}
