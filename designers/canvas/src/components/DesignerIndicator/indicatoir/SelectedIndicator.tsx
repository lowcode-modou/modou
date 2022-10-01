import { FC, RefObject } from 'react'
import { useWidgetSelected } from '../../../hooks/useWidgetSelected'
import { useRecoilValue } from 'recoil'
import { selectedWidgetIdAtom } from '../../../store'

interface SelectedIndicatorProps {
  canvasRef: RefObject<HTMLElement>
}

export const SelectedIndicator: FC<SelectedIndicatorProps> = ({ canvasRef }) => {
  const { style: selectedStyle } = useWidgetSelected(canvasRef)
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  return selectedWidgetId
    ? <div
    className='border-sky-400 border-dashed absolute'
    style={selectedStyle}
  />
    : null
}
