import {
  CSSProperties,
  FC,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useDrag } from 'react-dnd'
import { useRecoilValue } from 'recoil'

import { mcss, useTheme } from '@modou/css-in-js'

import { SimulatorInstanceContext } from '../../../contexts'
import { useWidgetSelected } from '../../../hooks/useWidgetSelected'
import {
  selectedWidgetIdAtom,
  widgetSelector,
  widgetsSelector,
} from '../../../store'
import { WidgetDragType } from '../../../types'
import { getElementFromWidgetId } from '../../../utils'
import { SelectedToolBox } from './SelectedToolBox'

const SelectIndicatorContent: FC = () => {
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  const [selectedElementRect, setSelectedElementRect] = useState<{
    x: number
    y: number
    width: number
    height: number
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const widgets = useRecoilValue(widgetsSelector)
  const [display, setDisplay] = useState(false)
  const [styleUpdater, setStyleUpdater] = useState(0)
  useEffect(() => {
    // void Promise.resolve().then(() => {
    //   setStyleUpdater((prevState) => prevState + 1)
    // })
    setTimeout(() => {
      setStyleUpdater((prevState) => prevState + 1)
    })
  }, [widgets])
  const simulatorInstance = useContext(SimulatorInstanceContext)
  useEffect(() => {
    if (!selectedWidgetId) {
      setDisplay(false)
      return
    }
    const rawElement = getElementFromWidgetId(
      selectedWidgetId,
      simulatorInstance.document!,
    )
    if (rawElement) {
      // TODO 可能有多个累加计算位置的情况
      const rect = rawElement.getClientRects()[0]
      setSelectedElementRect({
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      })
      setDisplay(true)
    } else {
      setSelectedElementRect({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      })
      setDisplay(false)
    }
  }, [selectedWidgetId, simulatorInstance.document, styleUpdater])
  const style: CSSProperties = {
    width: `${selectedElementRect.width ?? 0}px`,
    height: `${selectedElementRect.height ?? 0}px`,
    left: `${selectedElementRect.x ?? 0}px`,
    top: `${selectedElementRect.y ?? 0}px`,
    display: display ? 'block' : 'none',
  }

  const widget = useRecoilValue(widgetSelector(selectedWidgetId))
  // TODO 使用element
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: widget.widgetType,
      item: () => {
        return {
          type: WidgetDragType.Move,
          widget,
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      options: {
        dropEffect: 'copy',
      },
    }),
    [widget],
  )
  const opacity = isDragging ? '0.4' : '1'

  useEffect(() => {
    const element = getElementFromWidgetId(
      selectedWidgetId,
      simulatorInstance.document!,
    )
    if (element) {
      element.style.opacity = opacity
      preview(element)
    }
  }, [opacity, preview, selectedWidgetId, simulatorInstance.document])
  const theme = useTheme()

  return (
    <div
      ref={drag}
      className={classes.wrapper}
      style={{
        ...style,
        '--border-color': theme.colorPrimary,
      }}
    >
      <SelectedToolBox />
    </div>
  )
}

interface SelectedIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const SelectedIndicator: FC<SelectedIndicatorProps> = ({
  canvasRef,
}) => {
  useWidgetSelected(canvasRef)
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  return selectedWidgetId ? <SelectIndicatorContent /> : null
}

const classes = {
  wrapper: mcss`
    border: 1px dashed var(--border-color);
    position: absolute;
    z-index: 50;
  `,
}
