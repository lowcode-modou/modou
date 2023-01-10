import { makeAutoObservable } from '@modou/reactivity'

export * from './dnd'
export * from './page'
export enum DropIndicatorPositionEnum {
  Top,
  Right,
  Bottom,
  Left,
}

export enum DropIndicatorInsertPositionEnum {
  Before,
  After,
  Inner,
}

export interface DropIndicator {
  position: DropIndicatorPositionEnum
  insertPosition: DropIndicatorInsertPositionEnum
  show: boolean
}
export class CanvasDesignerStore {
  constructor() {
    makeAutoObservable(this)
  }

  selectedWidgetId: string = ''
  setSelectedWidgetId(widgetId: string) {
    this.selectedWidgetId = widgetId
  }

  dropIndicator: DropIndicator = {
    position: DropIndicatorPositionEnum.Left,
    insertPosition: DropIndicatorInsertPositionEnum.Inner,
    show: false,
  }
  setDropIndicator(dropIndicator: DropIndicator) {
    this.dropIndicator = dropIndicator
  }
}
