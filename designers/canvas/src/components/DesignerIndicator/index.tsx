import { FC, RefObject } from 'react'
import { HoveringIndicator } from './indicatoir/HoveringIndicator'
import { SelectedIndicator } from './indicatoir/SelectedIndicator'
import { DropIndicator } from './indicatoir/DropIndicator'

interface DesignerIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const DesignerIndicator: FC<DesignerIndicatorProps> = ({
  canvasRef
}) => {
  return <div className='fixed inset-0 pointer-events-none'>
    <HoveringIndicator canvasRef={canvasRef} />
    <SelectedIndicator canvasRef={canvasRef} />
    <DropIndicator canvasRef={canvasRef} />
  </div>
}
