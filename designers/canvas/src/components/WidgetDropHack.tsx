import { FC, useContext } from 'react'
import { WidgetBaseProps, WidgetFactoryContext } from '@modou/core'
import { useDrop } from 'react-dnd'

const WidgetDrop: FC<{
  widget: WidgetBaseProps
  element: HTMLElement
}> = ({ widget, element }) => {
  const widgetFactory = useContext(WidgetFactoryContext)
  // TODO 查看为什么能自动推断参数类型
  const [{ canDrop, isOver }, drop] = useDrop<{
    widget: WidgetBaseProps
  }, {
    widget: WidgetBaseProps
  }, {
    isOver: boolean
    canDrop: boolean
  }>(() => ({
    accept: Object.keys(widgetFactory.widgetByType),
    drop: (item, monitor) => {
      console.log(item.widget, widget)
      return { widget }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    })
  }))

  const isActive = canDrop && isOver
  const backgroundColor = '#222'
  // if (isActive) {
  //   backgroundColor = 'darkgreen'
  // } else if (canDrop) {
  //   backgroundColor = 'darkkhaki'
  // }
  drop(element)
  return null
}

export const WidgetDropHack: FC<{
  drops: Array<{
    widget: WidgetBaseProps
    element: HTMLElement
  }>
}> = ({ drops }) => {
  return <>{
    drops.map(({ widget, element }) => <WidgetDrop key={widget.widgetId} widget={widget} element={element} />)
  }</>
}
