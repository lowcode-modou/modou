import { difference, mapValues } from 'lodash'

import { MDVersion } from '@modou/core'
import { FileTypeEnum, UpdateParams } from '@modou/meta-vfs'

import { emitters } from '../event-bus'
import { atom, getDefaultStore, WritableAtom } from '@modou/state'

export const DEFAULT_FILE_STORE = getDefaultStore()

export type BaseFileMete<T extends object = {}> = {
  readonly id: string
  name: string
  readonly version: MDVersion
} & T

type FileAtom<T> = WritableAtom<T, [T | ((prev: T) => T)], T>

const createFileAtom = <Value>(
  value: Value,
  {
    sub,
  }: {
    sub: (newValue: Value, oldValue: Value) => void
  },
) => {
  const _atom = atom<Value>(value)
  return atom<Value, [Value | ((prev: Value) => Value)], Value>(
    (get) => get(_atom),
    (get, set, update) => {
      const oldValue = get(_atom)
      set(_atom, update)
      const newValue =
        typeof update === 'function'
          ? (update as (prev: Value) => Value)(oldValue)
          : update
      Promise.resolve().then(() => sub(newValue, oldValue))
      return newValue
    },
  )
}

export abstract class BaseFile<
  SubFilesMap extends Partial<Record<FileTypeEnum, BaseFile>> = {},
  Metadata extends BaseFileMete = BaseFileMete,
  ParentFile extends BaseFile | null = null,
> {
  static DEFAULT_FILE_STORE = DEFAULT_FILE_STORE
  protected constructor({
    fileType,
    meta,
    parentFile,
    subFileTypes,
  }: {
    fileType: FileTypeEnum
    meta: Metadata
    parentFile: ParentFile
    subFileTypes: Array<keyof SubFilesMap>
  }) {
    this.fileType = fileType
    this.parentFile = parentFile

    this.atom = createFileAtom(meta, {
      sub: (newValue, oldValue) => {
        emitters.emit('updateFileMeta', newValue)
      },
    })

    this.subFilesAtomMap = new Set(subFileTypes).values().reduce(
      (pre, fileType) => {
        pre[fileType as keyof SubFilesMap] = createFileAtom<Array<BaseFile>>(
          [],
          {
            sub: (newValue, oldValue) => {
              const newIds = newValue.map(
                (file) => DEFAULT_FILE_STORE.get(file.atom).id,
              )
              const oldIds = oldValue.map(
                (file) => DEFAULT_FILE_STORE.get(file.atom).id,
              )

              difference(newIds, oldIds).forEach((fileId) => {
                console.log(`${fileId}被删除了`)
              })
            },
          },
        ) as unknown as FileAtom<SubFilesMap[keyof SubFilesMap][]>
        return pre
      },
      {} as {
        [K in keyof SubFilesMap]: FileAtom<SubFilesMap[K][]>
      },
    )
  }

  updateMeta(meta: UpdateParams<Metadata>) {
    DEFAULT_FILE_STORE.set(this.atom, meta)
  }

  parentFile: ParentFile
  fileType: FileTypeEnum
  get meta() {
    return DEFAULT_FILE_STORE.get(this.atom)
  }
  atom: FileAtom<Metadata>

  readonly subFilesAtomMap: {
    [K in keyof SubFilesMap]: FileAtom<SubFilesMap[K][]>
  }

  protected subFileMapToJson() {
    return Object.values(this.subFilesAtomMap).map(
      (filesAtom: FileAtom<BaseFile[]>) =>
        // TODO 是否有些特殊的file需求sort
        DEFAULT_FILE_STORE.get(filesAtom).map((file) => file.toJSON()),
    )
  }

  abstract toJSON(): {
    id: string
    fileType: FileTypeEnum
    [prop: string]: any
  }
  static fromJSON() {
    throw new Error(`【${this.name}】未实现formJson方法`)
  }

  static create(
    meta: Omit<BaseFileMete, 'version'>,
    parentFile?: BaseFile,
  ): BaseFile {
    throw new Error(`【${this.name}】未实现create方法`)
  }
  // TODO fromFile toFile
}
