import { CSSProperties, FC, RefObject, useEffect, useState } from 'react'
import { useWidgetSelected } from '../../../hooks/useWidgetSelected'
import { useRecoilValue } from 'recoil'
import { selectedWidgetIdAtom, widgetsSelector } from '../../../store'
import { getElementFromWidgetId } from '../../../utils'
import { SelectedToolBox } from './SelectedToolBox'
import { useDrag } from 'react-dnd'
import { WidgetDragType } from '../../../types'
import { widgetSelector } from '@modou/render/src/store'

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
    void Promise.resolve().then(() => {
      setStyleUpdater((prevState) => prevState + 1)
    })
  }, [widgets])
  useEffect(() => {
    if (!selectedWidgetId) {
      setDisplay(false)
      return
    }
    const rawElement = getElementFromWidgetId(selectedWidgetId)
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
  }, [selectedWidgetId, styleUpdater])
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
    const element = getElementFromWidgetId(selectedWidgetId)
    if (element) {
      element.style.opacity = opacity
      preview(element)
    }
  }, [opacity, preview, selectedWidgetId])

  return (
    <div
      ref={drag}
      className="border-sky-400 border-dashed absolute z-50"
      style={style}
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
