// TODO 优化 asset vfs
import { AppFactory } from '@modou/core'
import { makeAutoObservable } from '@modou/reactivity'

// TODO 解决 不同 window 环境下使用不同React的问题
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
