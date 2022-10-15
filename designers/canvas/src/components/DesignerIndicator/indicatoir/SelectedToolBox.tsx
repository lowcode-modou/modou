import { FullscreenOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { FC, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { useRecoilValue } from 'recoil'

import { mcss, useTheme } from '@modou/css-in-js'
import { widgetSelector } from '@modou/render/src/store'

import {
  selectedWidgetIdAtom,
  widgetRelationByWidgetIdSelector,
} from '../../../store'
import { WidgetDragType } from '../../../types'
import { getElementFromWidgetId } from '../../../utils'

export const SelectedToolBox: FC = () => {
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)

  const widget = useRecoilValue(widgetSelector(selectedWidgetId))
  const widgetRelationByWidgetId = useRecoilValue(
    widgetRelationByWidgetIdSelector,
  )
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

  useEffect(() => {}, [isDragging])

  const opacity = isDragging ? '0.4' : '1'

  useEffect(() => {
    const element = getElementFromWidgetId(selectedWidgetId)
    if (element) {
      element.style.opacity = opacity
      preview(element)
    }
  }, [opacity, preview, selectedWidgetId])
  const theme = useTheme()

  return isDragging ||
    !widgetRelationByWidgetId[selectedWidgetId].parent ? null : (
    <div
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
          2
        </Button>
        <Button className={classes.button} type="primary">
          3
        </Button>
      </Button.Group>
    </div>
  )
}

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
