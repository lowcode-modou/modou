import { makeAutoObservable } from 'mobx'

export * from './dnd'
export * from './page'

class CanvasDesignerStore {
  constructor() {
    makeAutoObservable(this)
  }

  selectedWidgetId: string = ''
  setSelectedWidgetId(widgetId: string) {
    this.selectedWidgetId = widgetId
  }
}

export const canvasDesignerStore = new CanvasDesignerStore()
