import { UnwrapNestedRefs, reactive } from '@vue/reactivity'
import { mapValues } from 'lodash'

import { MDVersion } from '@modou/core'
import { FileTypeEnum } from '@modou/file/types'

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
    this.fileType = fileType
    this.meta = meta
    return reactive(this) as UnwrapNestedRefs<any>
  }

  fileType: FileTypeEnum
  meta: T

  fileMapToJson() {
    return mapValues(this.fileMap, (files) =>
      // TODO 是否有些特殊的file需求sort
      files.map((file) => file.toJSON()),
    )
  }

  abstract toJSON(): {
    id: string
    fileType: FileTypeEnum
    [prop: string]: any
  }
  abstract fileMap: F
  static fromJSON() {
    throw new Error(`【${this.name}】未实现formJson方法`)
  }

  static create(meta: BaseFileMete): BaseFile<any, any> {
    throw new Error(`【${this.name}】未实现create方法`)
  }
  // TODO fromFile toFile
}
