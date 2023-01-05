import { useKeyPress } from 'ahooks'
import { FC } from 'react'
import { useRecoilState } from 'recoil'

import { useRemoveWidget } from '../hooks'
import { selectedWidgetIdAtom } from '../store'

export const CanvasDesignerKeyPress: FC = () => {
  const [selectWidgetId, setSelectedWidgetId] =
    useRecoilState(selectedWidgetIdAtom)
  const { removeWidget } = useRemoveWidget()
  useKeyPress('delete', () => {
    if (selectWidgetId) {
      removeWidget(selectWidgetId)
      setSelectedWidgetId('')
    }
  })
  return null
}
