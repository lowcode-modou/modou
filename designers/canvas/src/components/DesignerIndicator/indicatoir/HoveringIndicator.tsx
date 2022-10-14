import { FC, RefObject } from 'react'

import { mcss, useTheme } from '@modou/css-in-js'

import { useWidgetHovering } from '../../../hooks'

interface HoveringIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const HoveringIndicator: FC<HoveringIndicatorProps> = ({
  canvasRef,
}) => {
  const theme = useTheme()
  const { style: hoveringStyle } = useWidgetHovering(canvasRef)
  return (
    <div
      className={classes.wrapper}
      style={{
        ...hoveringStyle,
        '--border-color': theme.colorPrimary,
      }}
    />
  )
}

const classes = {
  wrapper: mcss`
    border: 1px dashed var(--border-color);
    position: absolute;
    z-index: 999999;
  `,
}
