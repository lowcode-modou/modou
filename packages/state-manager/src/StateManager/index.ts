import { makeAutoObservable } from '@modou/reactivity'

import { AppState } from '../AppState'

export class StateManager {
  constructor(appState: AppState) {
    this.app = appState
    makeAutoObservable(this)
  }

  app: AppState
}
