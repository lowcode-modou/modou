import { FC, RefObject } from 'react'
import { useWidgetSelected } from '../../../hooks/useWidgetSelected'

interface SelectedIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const SelectedIndicator: FC<SelectedIndicatorProps> = ({ canvasRef }) => {
  const { style: selectedStyle } = useWidgetSelected(canvasRef)
  return <div
    className='border-sky-400 border-dashed absolute'
    style={selectedStyle}
  />
}
