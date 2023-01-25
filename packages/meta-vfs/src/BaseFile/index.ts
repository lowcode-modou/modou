import { get, isFunction, mapValues } from 'lodash'

import { MDVersion } from '@modou/core'
import { FileTypeEnum, UpdateParams } from '@modou/meta-vfs'
import {
  action,
  makeObservable,
  observable,
  reaction,
  toJS,
} from '@modou/reactivity'

import { emitters } from '../event-bus'

export type BaseFileMete<T extends object = {}> = {
  readonly id: string
  name: string
  readonly version: MDVersion
} & T

export interface BaseFileMap {
  readonly [prop: string]: Array<BaseFile<any, any, any>>
}

export abstract class BaseFile<
  F extends BaseFileMap,
  T extends BaseFileMete,
  P extends BaseFile<any, any, any> | null,
> {
  protected constructor({
    fileType,
    meta,
    parentFile,
  }: {
    fileType: FileTypeEnum
    meta: T
    parentFile: P
  }) {
    this.fileType = fileType
    this.meta = meta
    this.parentFile = parentFile
    makeObservable(this, {
      meta: observable,
      fileType: observable,
      parentFile: observable,
      updateMeta: action,
    })
    // 监听meta变化 包括subFile移动
    const disposer = reaction(
      () => toJS(this.meta),
      (newValue) => {
        emitters.emit('updateFileMeta', newValue)
      },
      {
        fireImmediately: true,
        delay: 300,
        // equals: comparer.structural,
      },
    )
    // 监听删除和添加
    const disposerSubFiles = reaction(
      () =>
        mapValues(this.subFileMap, (files) =>
          files.reduce<Record<string, BaseFile<any, any, any>>>((pre, cur) => {
            pre[cur.meta.id] = cur
            return pre
          }, {}),
        ),
      (newValue, prevValue) => {
        // 如果是删除 调用子文件的disposer方法
        // 找出删除的文件
        if (!prevValue) {
          return
        }
        Object.entries(prevValue).forEach(([fileType, filesMap]) =>
          Object.entries(filesMap).forEach(([fileId, file]) => {
            if (!get(newValue, [fileType, fileId])) {
              file.disposer()
            }
          }),
        )
      },
      {
        fireImmediately: true,
        delay: 300,
      },
    )
    this.disposer = () => {
      disposer()
      disposerSubFiles()
    }
  }

  updateMeta(meta: UpdateParams<T>) {
    if (isFunction(meta)) {
      this.meta = meta(this.meta)
    } else {
      this.meta = meta
    }
  }

  parentFile: P
  fileType: FileTypeEnum
  meta: T

  protected disposer: () => void

  protected subFileMapToJson() {
    return mapValues(this.subFileMap, (dir) =>
      // TODO 是否有些特殊的file需求sort
      dir.map((file) => file.toJSON()),
    )
  }

  abstract toJSON(): {
    id: string
    fileType: FileTypeEnum
    [prop: string]: any
  }
  abstract subFileMap: F
  static fromJSON() {
    throw new Error(`【${this.name}】未实现formJson方法`)
  }

  static create(
    meta: Omit<BaseFileMete, 'version'>,
    parentFile?: BaseFile<any, any, any>,
  ): BaseFile<any, any, any> {
    throw new Error(`【${this.name}】未实现create方法`)
  }
  // TODO fromFile toFile
}
