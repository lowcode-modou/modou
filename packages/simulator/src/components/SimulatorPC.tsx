import { forwardRef } from 'react'

import { mcss } from '@modou/css-in-js'

interface SimulatorPCProps {
  onLoad?: () => void
  src: string
}

export const SimulatorPC = forwardRef<HTMLIFrameElement, SimulatorPCProps>(
  ({ onLoad, src }, ref) => {
    return (
      <iframe ref={ref} className={classes.iframe} src={src} onLoad={onLoad} />
    )
  },
)
SimulatorPC.displayName = 'SimulatorPC'

const classes = {
  iframe: mcss`
    height: 100%;
    width: 100%;
    border: none;
    display: block;
  `,
}
