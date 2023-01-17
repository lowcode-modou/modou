import { useKeyPress } from 'ahooks'
import { FC } from 'react'

import { observer } from '@modou/reactivity-react'

import { useCanvasDesignerFile } from '../contexts/CanvasDesignerFileContext'
import { useCanvasDesignerStore } from '../contexts/CanvasDesignerStoreContext'

const _CanvasDesignerKeyPress: FC = () => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  const { canvasDesignerFile } = useCanvasDesignerFile()
  useKeyPress('delete', () => {
    if (canvasDesignerStore.selectedWidgetId) {
      canvasDesignerFile.removeWidget(canvasDesignerStore.selectedWidgetId)
      canvasDesignerStore.setSelectedWidgetId('')
    }
  })
  return null
}
export const CanvasDesignerKeyPress = observer(_CanvasDesignerKeyPress)
