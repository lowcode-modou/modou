import { AppFile } from '@modou/meta-vfs'
import { makeAutoObservable } from '@modou/reactivity'

import { PageState } from '../PageState'

interface User {
  name: string
  email: string
  id: string
}

export class AppState {
  constructor(file: AppFile) {
    this.file = file
    this.state = {
      id: file.meta.id,
      name: file.meta.name,
      user: {
        name: '张三',
        email: 'zhangsan@gmail.com',
        id: 'zhangsan',
      },
    }
    makeAutoObservable(this)
  }

  file: AppFile

  state: {
    id: string
    name: string
    user: User
  }

  subState: {
    page: Record<string, PageState>
  } = {
    page: {},
  }
  // pages: []
}
