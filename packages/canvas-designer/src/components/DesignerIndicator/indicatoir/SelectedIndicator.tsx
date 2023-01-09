import { observer } from 'mobx-react-lite'
import {
  CSSProperties,
  FC,
  RefObject,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useDrag } from 'react-dnd'

import { useAppManager } from '@modou/core'
import { mcss, useTheme } from '@modou/css-in-js'

import { SimulatorInstanceContext } from '../../../contexts'
import { useCanvasDesignerFile } from '../../../contexts/CanvasDesignerFileContext'
import { useCanvasDesignerStore } from '../../../contexts/CanvasDesignerStoreContext'
import { useWidgetSelected } from '../../../hooks/useWidgetSelected'
import { WidgetDragType } from '../../../types'
import { getRootElementFromWidgetId } from '../../../utils'
import { SelectedToolBox } from './SelectedToolBox'

const _SelectIndicatorContent: FC = () => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const { appManager } = useAppManager()
  const selectedWidgetId = canvasDesignerStore.selectedWidgetId
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
  const [display, setDisplay] = useState(false)
  const [styleUpdater, setStyleUpdater] = useState(0)

  // TODO 是否使用 watch deep
  useEffect(() => {
    // void Promise.resolve().then(() => {
    //   setStyleUpdater((prevState) => prevState + 1)
    // })
    setTimeout(() => {
      setStyleUpdater((prevState) => prevState + 1)
    })
  }, [canvasDesignerFile.widgets])
  const simulatorInstance = useContext(SimulatorInstanceContext)
  useEffect(() => {
    if (!selectedWidgetId) {
      setDisplay(false)
      return
    }
    const rawElement = getRootElementFromWidgetId(
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

  const widget = appManager.widgetMap.get(selectedWidgetId)!
  // TODO 使用element
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: widget.meta.type,
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
    const element = getRootElementFromWidgetId(
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
const SelectIndicatorContent = observer(_SelectIndicatorContent)

interface SelectedIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

const _SelectedIndicator: FC<SelectedIndicatorProps> = ({ canvasRef }) => {
  useWidgetSelected(canvasRef)
  const { canvasDesignerStore } = useCanvasDesignerStore()
  const selectedWidgetId = canvasDesignerStore.selectedWidgetId
  return selectedWidgetId ? <SelectIndicatorContent /> : null
}

export const SelectedIndicator = observer(_SelectedIndicator)

const classes = {
  wrapper: mcss`
    border: 1px dashed var(--border-color);
    position: absolute;
    z-index: 50;
  `,
}
