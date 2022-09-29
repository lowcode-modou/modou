import { CSSProperties, FC, memo } from 'react'
import { Col, Row, Typography } from 'antd'
import { useWidgetDrop } from '../hooks'
import { isEqual } from 'lodash'

interface DropElement {
  widgetId: string
  slotName: string
}

const WidgetDrop: FC<DropElement> = ({ widgetId, slotName }) => {
  const {
    style,
    showIndicator,
    widget,
    element,
    isActive
  } = useWidgetDrop({ widgetId, slotName })

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

interface WidgetDropHackProps {
  dropElements: DropElement[]
}

const _WidgetDropHack: FC<WidgetDropHackProps> = ({ dropElements }) => {
  // TODO use Memo 优化性能
  return <>{
    dropElements.map(({ widgetId, slotName }) =>
      <MemoWidgetDrop key={widgetId} widgetId={widgetId} slotName={slotName} />)
  }</>
}

export const WidgetDropHack = memo(_WidgetDropHack, isEqual)
