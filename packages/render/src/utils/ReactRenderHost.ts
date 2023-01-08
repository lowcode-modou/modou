import { AppManager, PageFile } from '@modou/meta-vfs'

export type UpdateAppManager = (appManager: AppManager) => void
export type UpdateFile = (file: PageFile) => void

export class ReactRenderHost {
  constructor({
    updateAppManager,
    updateFile,
  }: {
    updateAppManager: UpdateAppManager
    updateFile: UpdateFile
  }) {
    this.updateAppManager = updateAppManager
    this.updateFile = updateFile
  }

  updateAppManager
  updateFile
}
