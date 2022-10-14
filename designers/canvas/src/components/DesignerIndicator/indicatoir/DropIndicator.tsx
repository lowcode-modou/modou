import { useMutationObserver } from 'ahooks'
import { Col, Row, Typography, theme } from 'antd'
import {
  CSSProperties,
  FC,
  RefObject,
  memo,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'

import { mcss, useTheme } from '@modou/css-in-js'

import { useElementRect, useWidgetDrop } from '../../../hooks'
import {
  DropIndicatorPositionEnum,
  dropIndicatorAtom,
  widgetByIdSelector,
  widgetsSelector,
} from '../../../store'
import {
  getWidgetIdFromElement,
  getWidgetSlotNameFromElement,
} from '../../../utils'

const DROP_INDICATOR_PX = '3px'
const DROP_INDICATOR_OFFSET_PX = '-2px'

interface DropElement {
  widgetId: string
  slotName: string
}

const WidgetDrop: FC<DropElement> = ({ widgetId, slotName }) => {
  const widgets = useRecoilValue(widgetsSelector)
  const { isEmptySlot, widget, isActive, element } = useWidgetDrop({
    widgetId,
    slotName,
  })
  const dropIndicator = useRecoilValue(dropIndicatorAtom)

  const [styleUpdater, setStyleUpdater] = useState(0)
  const { style } = useElementRect(element, {
    deps: [styleUpdater],
  })

  useEffect(() => {
    void Promise.resolve().then(() => {
      setStyleUpdater((prevState) => prevState + 1)
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
          left: 0,
        }
      case DropIndicatorPositionEnum.Right:
        return {
          width: DROP_INDICATOR_PX,
          height: '100%',
          top: 0,
          right: DROP_INDICATOR_OFFSET_PX,
        }
      case DropIndicatorPositionEnum.Bottom:
        return {
          width: '100%',
          height: DROP_INDICATOR_PX,
          bottom: DROP_INDICATOR_OFFSET_PX,
          left: 0,
        }
      case DropIndicatorPositionEnum.Left:
        return {
          width: DROP_INDICATOR_PX,
          height: '100%',
          top: 0,
          left: DROP_INDICATOR_OFFSET_PX,
        }
      default:
        return {}
    }
  }, [dropIndicator.position, dropIndicator.show])

  const theme = useTheme()

  return (
    <>
      {isEmptySlot ? (
        <Row
          justify="center"
          align="middle"
          className={widgetDropClasses.emptyWrapper}
          style={style}
        >
          <Col>
            <Typography.Text type={'secondary'} strong>
              {widget.widgetType}
            </Typography.Text>
          </Col>
        </Row>
      ) : null}
      {isActive ? (
        <Row className={widgetDropClasses.activeWrapper} style={{ ...style }}>
          <div
            className={widgetDropClasses.active}
            style={{
              ...dropIndicatorStyle,
              '--bg-color': theme.colorError,
            }}
          />
        </Row>
      ) : null}
    </>
  )
}

const widgetDropClasses = {
  emptyWrapper: mcss`
    border: 1px dashed rgba(0,0,0,.6);
		position: fixed;
    pointer-events: none;
  `,
  activeWrapper: mcss`
    pointer-events: none;
    position: fixed;
    z-index: 999;
  `,
  active: mcss`
    position: absolute;
    background-color: var(--bg-color);
  `,
}

const MemoWidgetDrop = memo(WidgetDrop)

export const DropIndicator: FC<{
  canvasRef: RefObject<HTMLElement>
}> = ({ canvasRef }) => {
  // TODO use Memo 优化性能
  const widgetById = useRecoilValue(widgetByIdSelector)

  const [dropElements, setDropElements] = useState<
    Array<{
      widgetId: string
      slotName: string
    }>
  >([])

  // TODO target 切换为 canvas root element
  useMutationObserver(
    () => {
      const elements = [
        ...document.querySelectorAll('[data-widget-id]'),
      ] as HTMLElement[]
      setDropElements(
        elements
          .map((element) => ({
            widgetId: getWidgetIdFromElement(element),
            slotName: getWidgetSlotNameFromElement(element),
          }))
          .filter((widget) => !!widget),
      )
    },
    canvasRef,
    {
      childList: true,
      subtree: true,
    },
  )
  const dropElementsRendered = useMemo(() => {
    return dropElements.filter(({ widgetId }) =>
      Reflect.has(widgetById, widgetId),
    )
  }, [dropElements, widgetById])
  return (
    <>
      {dropElementsRendered.map(({ widgetId, slotName }) => (
        <MemoWidgetDrop
          key={widgetId}
          widgetId={widgetId}
          slotName={slotName}
        />
      ))}
    </>
  )
}
