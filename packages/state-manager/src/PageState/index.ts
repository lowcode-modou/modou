import { makeAutoObservable } from '@modou/reactivity'

import { WidgetState } from '../WidgetState'

export class PageState {
  constructor({ id, name }: { id: string; name: string }) {
    this.state = { id, name }
    makeAutoObservable(this)
  }

  state: {
    id: string
    name: string
  }

  subState: {
    widget: Map<string, WidgetState>
  } = {
    widget: new Map(),
  }
}
