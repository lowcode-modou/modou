import { makeAutoObservable } from '@modou/reactivity'

import { AppFactory } from './app-factory'

export class AssetVFS {
  constructor({ appFactory }: { appFactory: AppFactory }) {
    this.appFactory = appFactory
    if (AssetVFS.instance) {
      return AssetVFS.instance
    } else {
      makeAutoObservable(this)
      AssetVFS.instance = this
    }
  }

  appFactory: AppFactory

  private static instance: AssetVFS
}
