import { mapValues } from 'lodash'
import { makeObservable, observable } from 'mobx'

import { MDVersion } from '@modou/core'
import { FileTypeEnum } from '@modou/file'

export type BaseFileMete<T extends object = {}> = {
  readonly id: string
  name: string
  readonly version: MDVersion
} & T

export interface BaseFileMap {
  readonly [prop: string]: Array<BaseFile<any, any>>
}

export abstract class BaseFile<F extends BaseFileMap, T extends BaseFileMete> {
  protected constructor({
    fileType,
    meta,
  }: {
    fileType: FileTypeEnum
    meta: T
  }) {
    makeObservable(this, {
      meta: observable,
      fileType: observable,
    })
    this.fileType = fileType
    this.meta = meta
  }

  fileType: FileTypeEnum
  meta: T

  subFileMapToJson() {
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

  static create(meta: BaseFileMete): BaseFile<any, any> {
    throw new Error(`【${this.name}】未实现create方法`)
  }
  // TODO fromFile toFile
}
