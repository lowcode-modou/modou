import { FC } from 'react'
import { useRecoilValue } from 'recoil'

import { mcss } from '@modou/css-in-js'
import { ReactRender } from '@modou/render'

import { pageSelector } from '../store'

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
