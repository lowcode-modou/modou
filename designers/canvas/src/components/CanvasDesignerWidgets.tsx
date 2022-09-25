import { CSSProperties, FC, useContext, useMemo } from 'react'
import { Widget, WidgetFactoryContext } from '@modou/core'
import { Col, Row } from 'antd'
import { useDraggable } from '@dnd-kit/core'
import { generateId } from '@modou/core/src/utils'

const WidgetBlock: FC<{
  metadata: Widget
}> = ({ metadata }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: metadata.widgetType,
    data: {
      widget: {
        ...Widget.mrSchemeToDefaultJson(metadata.jsonPropsSchema),
        widgetId: generateId()
      }
    }
  })
  const style: CSSProperties | undefined = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: '999'
      }
    : undefined
  return <Col
    ref={setNodeRef}
    style={style}
    {...listeners}
    {...attributes}
    span={12}>
    <div
      className='border-1 border-solid text-center cursor-move select-none'
    >{metadata.widgetName}</div>
  </Col>
}

export const CanvasDesignerWidgets: FC = () => {
  const widgetFactory = useContext(WidgetFactoryContext)
  const widgets = useMemo(() => {
    return Object.values(widgetFactory.widgetByType)
  }, [widgetFactory.widgetByType])
  // TODO 拖动后保留位置
  // https://master--5fc05e08a4a65d0021ae0bf2.chromatic.com/
  // ?path=/docs/core-draggable-components-dragoverlay--basic-setup
  return <>
    <Row
      gutter={[16, 16]}>
      {
        widgets.map(({ metadata }) => {
          return <WidgetBlock metadata={metadata} key={metadata.widgetType} />
        })
      }
    </Row>
    {/* <DragOverlay > */}
    {/*  Demo */}
    {/* </DragOverlay> */}
  </>
}
