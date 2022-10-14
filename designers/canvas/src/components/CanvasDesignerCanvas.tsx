import { FC } from 'react'
import { ReactRender } from '@modou/render'
import { useRecoilValue } from 'recoil'
import { pageSelector } from '../store'
import { mcss } from '@modou/css-in-js'

// interface CanvasDesignerCanvasProps {
//   // rootWidgetId: string
// }

export const CanvasDesignerCanvas: FC = () => {
  const { widgets, rootWidgetId } = useRecoilValue(pageSelector)
  return (
    <div className={classes.wrapper}>
      <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    height: 100%;
    position: revert;
    padding: 16px;
  `,
}
