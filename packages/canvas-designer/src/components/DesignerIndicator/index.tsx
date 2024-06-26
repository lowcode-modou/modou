import { CSSProperties, FC, RefObject } from 'react'

import { mcss } from '@modou/css-in-js'

import { DropIndicator } from './indicatoir/DropIndicator'
import { HoveringIndicator } from './indicatoir/HoveringIndicator'
import { SelectedIndicator } from './indicatoir/SelectedIndicator'

interface DesignerIndicatorProps {
  canvasRef: RefObject<HTMLElement>
  style: CSSProperties
}

export const DesignerIndicator: FC<DesignerIndicatorProps> = ({
  canvasRef,
  style,
}) => {
  return (
    <div className={classes.wrapper} style={style}>
      <HoveringIndicator canvasRef={canvasRef} />
      <SelectedIndicator canvasRef={canvasRef} />
      <DropIndicator />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    position: fixed;
    left: 0;right: 0;bottom: 0;top: 0;
    pointer-events: none;
    z-index: 999;
  `,
}
