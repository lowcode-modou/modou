import { isFunction, mapValues } from 'lodash'

import { MDVersion } from '@modou/core'
import { FileTypeEnum, UpdateParams } from '@modou/meta-vfs'
import { action, makeObservable, observable } from '@modou/reactivity'

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
