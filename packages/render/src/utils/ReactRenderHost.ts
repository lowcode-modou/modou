import { AppManager, PageFile } from '@modou/meta-vfs'
import { AppState, PageState } from '@modou/state-manager'

export type UpdateAppManager = (appManager: AppManager) => void
export type UpdateFile = (file: PageFile) => void

export type UpdateAppState = (appState: AppState) => void
export type UpdateState = (file: PageState) => void

export class ReactRenderHost {
  constructor({
    updateAppManager,
    updateFile,
    updateAppState,
    updateState,
  }: {
    updateAppManager: UpdateAppManager
    updateFile: UpdateFile
    updateAppState: UpdateAppState
    updateState: UpdateState
  }) {
    this.updateAppManager = updateAppManager
    this.updateFile = updateFile
    this.updateAppState = updateAppState
    this.updateState = updateState
  }

  updateAppManager
  updateFile
  updateAppState
  updateState
}
