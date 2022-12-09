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
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'

import { AppFactoryContext } from '@modou/core'
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
  getWidgetSlotPathFromElement,
} from '../../../utils'

const DROP_INDICATOR_PX = '3px'
const DROP_INDICATOR_OFFSET_PX = '-2px'

interface DropElement {
  widgetId: string
  slotPath: string
}

const WidgetDrop: FC<DropElement> = ({ widgetId, slotPath }) => {
  const widgets = useRecoilValue(widgetsSelector)
  const appFactory = useContext(AppFactoryContext)
  // FIXME element 有可能会重复
  const elementSelector = `[data-widget-id=${widgetId}]${
    slotPath ? `[data-widget-slot-path=${slotPath}]` : ''
  }`
  const simulatorInstance = useContext(SimulatorInstanceContext)

  const element = simulatorInstance.document!.querySelector(
    elementSelector,
  ) as HTMLElement

  const { isEmptySlot, widget, isActive } = useWidgetDrop({
    widgetId,
    slotPath,
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

  const widgetMetadata = appFactory.widgetByType[widget.widgetType].metadata

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
              {widgetMetadata.widgetName}-{widgetMetadata.slots[slotPath].name}
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
		border: 1px solid rgba(0,0,0,.1);
    background-color: rgba(0,0,0,.05);
		position: absolute;
		pointer-events: none;
  `,
  activeWrapper: mcss`
		pointer-events: none;
		position: absolute;
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
      slotPath: string
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
          slotPath: getWidgetSlotPathFromElement(element),
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
      {dropElementsRendered.map(({ widgetId, slotPath }) => (
        <MemoWidgetDrop
          key={widgetId + slotPath}
          widgetId={widgetId}
          slotPath={slotPath}
        />
      ))}
    </>
  )
}
