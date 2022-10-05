import { CSSProperties, FC, useEffect } from 'react'
import { Button } from 'antd'
import { FullscreenOutlined } from '@ant-design/icons'
import { useRecoilValue } from 'recoil'
import { selectedWidgetIdAtom, widgetRelationByWidgetIdSelector } from '../../../store'
import { widgetSelector } from '@modou/render/src/store'
import { useDrag } from 'react-dnd'
import { getElementFromWidgetId } from '../../../utils'
import { WidgetDragType } from '../../../types'

const buttonStyle: CSSProperties = {
  height: '16px',
  lineHeight: '16px',
  fontSize: '12px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}

const boxStyle: CSSProperties = {
  transform: 'translateY(-100%)',
  marginTop: '-2px',
  borderRadius: '3px',
  height: '16px',
  display: 'flex',
  alignItems: 'center'
}

export const SelectedToolBox: FC = () => {
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)

  const widget = useRecoilValue(widgetSelector(selectedWidgetId))
  const widgetRelationByWidgetId = useRecoilValue(widgetRelationByWidgetIdSelector)
  const [{ isDragging }, drag, preview] = useDrag(() => ({
    type: widget.widgetType,
    item: () => {
      return {
        type: WidgetDragType.Move,
        widget
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    }),
    options: {
      dropEffect: 'copy'
    }
  }), [widget])

  const opacity = isDragging ? '0.4' : '1'

  useEffect(() => {
    const element = getElementFromWidgetId(selectedWidgetId)
    if (element) {
      element.style.opacity = opacity
      preview(element)
    }
  }, [opacity, preview, selectedWidgetId])

  return isDragging || !widgetRelationByWidgetId[selectedWidgetId].parent
    ? null
    : <div
      style={boxStyle}
      className='bg-blue-300 absolute left-0 pointer-events-auto'>
      <Button.Group style={buttonStyle} size='small'>
        <Button
          ref={drag}
          style={buttonStyle}
          className='cursor-move'
          type='primary' icon={<FullscreenOutlined style={buttonStyle} />} />
        <Button
          style={buttonStyle}
          type='primary'>2</Button>
        <Button
          style={buttonStyle}
          type='primary'>3</Button>
      </Button.Group>
    </div>
}
