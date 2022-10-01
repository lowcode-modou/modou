import { CSSProperties, FC, memo, useEffect, useMemo, useState } from 'react'
import { Col, Row, Typography } from 'antd'
import { useElementRect, useWidgetDrop } from '../../../hooks'
import { useRecoilValue } from 'recoil'
import { dropIndicatorAtom, DropIndicatorPositionEnum, widgetByIdSelector, widgetsAtom } from '../../../store'
import { useMutationObserver } from 'ahooks'
import { getWidgetIdFromElement, getWidgetSlotNameFromElement } from '../../../utils'

const DROP_INDICATOR_PX = '3px'
const DROP_INDICATOR_OFFSET_PX = '-2px'

interface DropElement {
  widgetId: string
  slotName: string
}

const WidgetDrop: FC<DropElement> = ({ widgetId, slotName }) => {
  const widgets = useRecoilValue(widgetsAtom)
  const {
    isEmptySlot,
    widget,
    isActive,
    element
  } = useWidgetDrop({ widgetId, slotName })
  const dropIndicator = useRecoilValue(dropIndicatorAtom)

  const [styleUpdater, setStyleUpdater] = useState(0)
  const { style } = useElementRect(element, {
    deps: [styleUpdater]
  })

  useEffect(() => {
    void Promise.resolve().then(() => {
      setStyleUpdater(prevState => prevState + 1)
    })
  }, [widgets])

  const dropIndicatorStyle: CSSProperties = useMemo(() => {
    if (!dropIndicator.show) {
      return {}
    }

    switch (dropIndicator.position) {
      case DropIndicatorPositionEnum.Top:
        return {
          width: '100%',
          height: DROP_INDICATOR_PX,
          top: DROP_INDICATOR_OFFSET_PX,
          left: 0
        }
      case DropIndicatorPositionEnum.Right:
        return {
          width: DROP_INDICATOR_PX,
          height: '100%',
          top: 0,
          right: DROP_INDICATOR_OFFSET_PX
        }
      case DropIndicatorPositionEnum.Bottom:
        return {
          width: '100%',
          height: DROP_INDICATOR_PX,
          bottom: DROP_INDICATOR_OFFSET_PX,
          left: 0
        }
      case DropIndicatorPositionEnum.Left:
        return {
          width: DROP_INDICATOR_PX,
          height: '100%',
          top: 0,
          left: DROP_INDICATOR_OFFSET_PX
        }
      default:
        return {}
    }
  }, [dropIndicator.position, dropIndicator.show])

  return <>{
    isEmptySlot
      ? <Row
        justify='center'
        align='middle'
        className={'border-dashed border-1 fixed pointer-events-none'}
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
          <div className={'absolute bg-red-500'} style={dropIndicatorStyle} />
        </Row>
        : null
    }
  </>
}

const MemoWidgetDrop = memo(WidgetDrop)

export const DropIndicator: FC = () => {
  // TODO use Memo 优化性能
  const widgetById = useRecoilValue(widgetByIdSelector)

  const [dropElements, setDropElements] = useState<Array<{
    widgetId: string
    slotName: string
  }>>([])

  // TODO target 切换为 canvas root element
  useMutationObserver(() => {
    const elements = [...document.querySelectorAll('[data-widget-id]')] as HTMLElement[]
    setDropElements(elements.map(element => ({
      widgetId: getWidgetIdFromElement(element),
      slotName: getWidgetSlotNameFromElement(element)
    })).filter((widget) => !!widget))
  }, document.body, {
    childList: true,
    subtree: true
  })

  const dropElementsRendered = useMemo(() => {
    return dropElements.filter(({ widgetId }) => Reflect.has(widgetById, widgetId))
  }, [dropElements, widgetById])
  return <>{
    dropElementsRendered.map(({ widgetId, slotName }) =>
      <MemoWidgetDrop key={widgetId} widgetId={widgetId} slotName={slotName} />)
  }</>
}
