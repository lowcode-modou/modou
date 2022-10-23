import { useMount, useMutationObserver } from 'ahooks'
import { Col, Row, Typography } from 'antd'
import {
  CSSProperties,
  FC,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'

import { mcss, useTheme } from '@modou/css-in-js'

import { SimulatorInstanceContext } from '../../../contexts'
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

const WidgetDropIframeContext: FC<{ element: HTMLElement } & DropElement> = ({
  widgetId,
  slotName,
  element,
}) => {
  useWidgetDrop({
    widgetId,
    slotName,
    element,
  })
  return null
}

const WidgetDropIframe: FC<
  {
    style: CSSProperties
  } & DropElement
> = ({ style, slotName, widgetId }) => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={wrapperRef}
      className={widgetDropIframeClasses.wrapper}
      style={{
        ...style,
      }}
    >
      {wrapperRef.current && (
        <WidgetDropIframeContext
          widgetId={widgetId}
          slotName={slotName}
          element={wrapperRef.current}
        />
      )}
    </div>
  )
}
const widgetDropIframeClasses = {
  wrapper: mcss`
    position: fixed;
    z-index: 99999999;
    border: 1px solid green;
    pointer-events: auto;
  `,
}

const WidgetDrop: FC<DropElement> = ({ widgetId, slotName }) => {
  const widgets = useRecoilValue(widgetsSelector)
  // FIXME element 有可能会重复
  const elementSelector = `[data-widget-id=${widgetId}]${
    slotName ? `[data-widget-slot-name=${slotName}]` : ''
  }`
  const simulatorInstance = useContext(SimulatorInstanceContext)

  const element = simulatorInstance.document!.querySelector(
    elementSelector,
  ) as HTMLElement
  const { isEmptySlot, widget, isActive } = useWidgetDrop({
    widgetId,
    slotName,
    element,
  })
  const dropIndicator = useRecoilValue(dropIndicatorAtom)

  const [styleUpdater, setStyleUpdater] = useState(0)
  const { style } = useElementRect(element, {
    deps: [styleUpdater],
  })
  useEffect(() => {
    // void Promise.resolve().then(() => {
    //   setStyleUpdater((prevState) => prevState + 1)
    // })
    setTimeout(() => {
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
      {/* <WidgetDropIframe style={style} slotName={slotName} widgetId={widgetId} /> */}
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

export const DropIndicator: FC = () => {
  // TODO use Memo 优化性能
  const widgetById = useRecoilValue(widgetByIdSelector)

  const [dropElements, setDropElements] = useState<
    Array<{
      widgetId: string
      slotName: string
    }>
  >([])
  const simulatorInstance = useContext(SimulatorInstanceContext)

  const initDrop = useCallback(() => {
    const elements = [
      ...(simulatorInstance?.document?.querySelectorAll('[data-widget-id]') ??
        []),
    ] as HTMLElement[]
    setDropElements(
      elements
        .map((element) => ({
          widgetId: getWidgetIdFromElement(element),
          slotName: getWidgetSlotNameFromElement(element),
        }))
        .filter((widget) => !!widget),
    )
  }, [simulatorInstance?.document])
  useMount(initDrop)
  useMutationObserver(initDrop, simulatorInstance.document?.body, {
    childList: true,
    subtree: true,
  })
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
