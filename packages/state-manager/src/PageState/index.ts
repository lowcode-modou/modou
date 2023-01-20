import { PageFile } from '@modou/meta-vfs'
import { makeAutoObservable } from '@modou/reactivity'

import { WidgetState } from '../WidgetState'

export class PageState {
  constructor(file: PageFile) {
    this.file = file
    this.state = {
      id: file.meta.id,
      name: file.meta.name,
    }
    makeAutoObservable(this)
  }

  file: PageFile

  state: {
    id: string
    name: string
  }

  subState: {
    widget: Record<string, WidgetState>
  } = {
    widget: {},
  }
}
