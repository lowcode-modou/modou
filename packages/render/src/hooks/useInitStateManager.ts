import { useEffect, useState } from 'react'

import { AppFile, PageFile } from '@modou/meta-vfs'
import { AppState, PageState, StateManager } from '@modou/state-manager'

export const useInitStateManager = ({
  app,
  file,
}: {
  app?: AppFile
  file?: PageFile
}) => {
  const [stateManager, setStateManager] = useState<StateManager>()
  useEffect(() => {
    if (!app || !file) {
      return
    }
    setStateManager(
      new StateManager({
        appState: new AppState(app),
        canvasState: new PageState(file),
      }),
    )
  }, [app, file])
  return {
    stateManager,
  }
}
