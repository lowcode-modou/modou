import { FC } from 'react'

import { mcss } from '@modou/css-in-js'
import { FlowDesigner } from '@modou/flow-designer'

export const FlowCanvas: FC = () => {
  return (
    <div className={classes.wrapper}>
      <FlowDesigner />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    height: 100%;
    flex: 1;
  `,
}
