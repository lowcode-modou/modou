import { FC, RefObject } from 'react'
import { useWidgetHovering } from '../../../hooks'

interface HoveringIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const HoveringIndicator: FC<HoveringIndicatorProps> = ({ canvasRef }) => {
  const { style: hoveringStyle } = useWidgetHovering(canvasRef)
  return <div
    className='border-sky-400 border-dashed absolute'
    style={hoveringStyle}
  />
}
