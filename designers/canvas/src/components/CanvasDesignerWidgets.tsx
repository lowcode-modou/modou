import { FC, useContext, useMemo } from 'react'
import { Widget, WidgetBaseProps, WidgetFactoryContext } from '@modou/core'
import { Col, Row } from 'antd'
import { useDrag } from 'react-dnd'
import { generateId } from '@modou/core/src/utils'

const WidgetBlock: FC<{
  metadata: Widget
}> = ({ metadata }) => {
  const widgetFactory = useContext(WidgetFactoryContext)
  const [{ isDragging }, drag] = useDrag(() => ({
    type: metadata.widgetType,
    item: () => ({
      widget: {
        ...Widget.mrSchemeToDefaultJson(widgetFactory.widgetByType[metadata.widgetType].metadata.jsonPropsSchema),
        widgetId: generateId()
      }
    }),
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<WidgetBaseProps>()
      if (item && dropResult) {
        // console.log(item, dropResult)
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId()
    })
  }))

  const opacity = isDragging ? 0.4 : 1
  return <Col
    ref={drag}
    style={{ opacity }}
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
  return <>
    <Row
      gutter={[16, 16]}>
      {
        widgets.map(({ metadata }) => {
          return <WidgetBlock metadata={metadata} key={metadata.widgetType} />
        })
      }
    </Row>
  </>
}
