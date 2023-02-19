import { FullscreenOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { FC, useContext, useEffect, useRef } from 'react'
import { useDrag } from 'react-dnd'

import { mcss, useTheme } from '@modou/css-in-js'
import { useAppManager } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'

import { SimulatorInstanceContext } from '../../../contexts'
import { useCanvasDesignerFile } from '../../../contexts/CanvasDesignerFileContext'
import { useCanvasDesignerStore } from '../../../contexts/CanvasDesignerStoreContext'
import { WidgetDragType } from '../../../types'
import { getRootElementFromWidgetId } from '../../../utils'

const _SelectedToolBox: FC = () => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  const { appManager } = useAppManager()
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const { widgetRelationById } = canvasDesignerFile

  const selectedWidgetId = canvasDesignerStore.selectedWidgetId
  const wrapperRef = useRef<HTMLDivElement>(null)
  const widget = appManager.widgetMap[selectedWidgetId]
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: widget.meta.type,
      item: () => {
        return {
          type: WidgetDragType.Move,
          widget: widget.meta,
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

  useEffect(() => {}, [isDragging])

  const opacity = isDragging ? '0.4' : '1'
  const simulatorInstance = useContext(SimulatorInstanceContext)

  useEffect(() => {
    const element = getRootElementFromWidgetId(
      selectedWidgetId,
      simulatorInstance.document!,
    )
    // const previewWrapperEl = document.createElement('div')
    // previewWrapperEl.style.position = 'absolute'
    // previewWrapperEl.style.top = '-1px'
    // previewWrapperEl.style.right = '20px'
    // previewWrapperEl.style.bottom = '20px'
    // previewWrapperEl.style.left = '-1px'
    if (element) {
      // const previewEl = element.cloneNode(true) as unknown as HTMLElement
      // previewWrapperEl.style.opacity = opacity
      // previewWrapperEl.appendChild(previewEl)
      // wrapperRef.current?.parentElement?.appendChild(previewWrapperEl)
      preview(element)
      // preview(previewEl)
    }
    // return () => {
    //   wrapperRef.current?.parentElement?.removeChild(previewWrapperEl)
    // }
  }, [
    opacity,
    preview,
    selectedWidgetId,
    simulatorInstance.document,
    isDragging,
  ])
  const theme = useTheme()

  return isDragging || !widgetRelationById[selectedWidgetId].parent ? null : (
    <div
      ref={wrapperRef}
      style={{
        '--border-color': theme.colorPrimary,
      }}
      className={classes.box}
    >
      <Button.Group className={classes.button} size="small">
        <Button
          ref={drag}
          className={`${classes.button} ${classes.dragButton}`}
          type="primary"
          icon={<FullscreenOutlined className={classes.button} />}
        />
        <Button className={classes.button} type="primary">
          {widget.meta.name}
        </Button>
        {/* <Button className={classes.button} type="primary">
          2
        </Button>
        <Button className={classes.button} type="primary">
          3
        </Button> */}
      </Button.Group>
    </div>
  )
}
export const SelectedToolBox = observer(_SelectedToolBox)

const classes = {
  button: mcss`
		height: 16px!important;
		line-height:16px!important;
		font-size: 12px!important;
		display: flex!important;
		justify-content: center!important;
		align-items: center!important;
  `,
  dragButton: mcss`
    cursor: move!important;
  `,
  box: mcss`
		transform: translateY(-100%);
		margin-top: -2px;
		border-radius: 3px;
		height: 16px;
		display: flex;
		align-items: center;
    //border: 1px solid var(--border-color);
    left: 0;
    pointer-events:auto;
  `,
}
