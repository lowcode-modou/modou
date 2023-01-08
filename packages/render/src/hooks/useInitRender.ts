import { useEffect } from 'react'

import { ReactRenderHost } from '../utils'
import { UpdateAppManager, UpdateFile } from '../utils/ReactRenderHost'

export const useInitRender = ({
  updateFile,
  updateAppManager,
}: {
  updateAppManager: UpdateAppManager
  updateFile: UpdateFile
}) => {
  useEffect(() => {
    if (!window.reactRenderHost) {
      window.reactRenderHost = new ReactRenderHost({
        updateAppManager,
        updateFile,
      })
    }
  }, [updateFile, updateAppManager])
}
