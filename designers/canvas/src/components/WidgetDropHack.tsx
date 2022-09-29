import { CSSProperties, FC, memo } from 'react'
import { Col, Row, Typography } from 'antd'
import { useWidgetDrop } from '../hooks'

const WidgetDrop: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const {
    style,
    showIndicator,
    widget,
    element,
    isActive
  } = useWidgetDrop(widgetId)

  const isBlockWidget = element.offsetWidth === element.parentElement?.clientWidth

  // const dropIndicatorPosition = isBlockWidget ? 'left' : 'bottom'

  const dropIndicatorStyle: CSSProperties = isBlockWidget
    ? {
        borderBottom: 'solid'
      }
    : {
        borderRightStyle: 'solid'
      }

  return <>{
    showIndicator
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
    {
      isActive
        ? <Row
          className='pointer-events-none fixed'
          style={{ ...style, zIndex: 999 }}>
          <div className='absolute !border-red-500 inset-0'
               style={{ ...dropIndicatorStyle, borderWidth: '3px' }}
          />
        </Row>
        : null
    }
  </>
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
