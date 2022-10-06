import { FC } from 'react'
import { useKeyPress } from 'ahooks'
import { selectedWidgetIdAtom } from '../store'
import { useRecoilState } from 'recoil'
import { useRemoveWidget } from '../hooks'

export const CanvasDesignerKeyPress: FC = () => {
  const [selectWidgetId, setSelectedWidgetId] = useRecoilState(selectedWidgetIdAtom)
  const { removeWidget } = useRemoveWidget()
  useKeyPress('delete', () => {
    if (selectWidgetId) {
      removeWidget(selectWidgetId)
      setSelectedWidgetId('')
    }
  })
  return null
}
