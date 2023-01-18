import { makeAutoObservable } from '@modou/reactivity'

import { PageState } from '../PageState'

interface User {
  name: string
  email: string
  id: string
}

export class AppState {
  constructor({ user, id, name }: { user: User; id: string; name: string }) {
    this.state = {
      id,
      name,
      user,
    }
    makeAutoObservable(this)
  }

  state: {
    id: string
    name: string
    user: User
  }

  subState: {
    page: Map<string, PageState>
  } = {
    page: new Map(),
  }
  // pages: []
}
