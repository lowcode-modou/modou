import { makeAutoObservable } from '@modou/reactivity'

import { AppState } from '../AppState'
import { PageState } from '../PageState'

export class StateManager {
  constructor({
    appState,
    canvasState,
  }: {
    appState: AppState
    canvasState: PageState
  }) {
    this.app = appState
    this.canvas = canvasState
    makeAutoObservable(this)
  }

  app: AppState
  canvas: PageState
}
