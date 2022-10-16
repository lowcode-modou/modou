import { FC, RefObject } from 'react'

import { mcss } from '@modou/css-in-js'

import { DropIndicator } from './indicatoir/DropIndicator'
import { HoveringIndicator } from './indicatoir/HoveringIndicator'
import { SelectedIndicator } from './indicatoir/SelectedIndicator'

interface DesignerIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const DesignerIndicator: FC<DesignerIndicatorProps> = ({
  canvasRef,
}) => {
  return (
    <div className={classes.wrapper}>
      <HoveringIndicator canvasRef={canvasRef} />
      <SelectedIndicator canvasRef={canvasRef} />
      <DropIndicator canvasRef={canvasRef} />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    position: fixed;
    left: 0;right: 0;bottom: 0;top: 0;
    pointer-events: none;
  `,
}
