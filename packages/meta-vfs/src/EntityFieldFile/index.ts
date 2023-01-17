import { omit } from 'lodash'

import { EntityField } from '@modou/core'
import { makeObservable, observable, runInAction } from '@modou/reactivity'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { EntityFile } from '../EntityFile'
import { FileTypeEnum } from '../types'

export type EntityFieldFileMeta = BaseFileMete<EntityField>
export class EntityFieldFile extends BaseFile<
  {},
  EntityFieldFileMeta,
  EntityFile
> {
  protected constructor(meta: EntityFieldFileMeta, parentFile: EntityFile) {
    super({ fileType: FileTypeEnum.EntityField, meta, parentFile })
    makeObservable(this, {
      subFileMap: observable,
    })
  }

  subFileMap = {}

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: EntityFieldFileMeta, parentFile: EntityFile) {
    return runInAction(() => {
      const entityFieldFile = new EntityFieldFile(meta, parentFile)
      parentFile.entityFields.push(entityFieldFile)
      return entityFieldFile
    })
  }

  static formJSON(
    json: ReturnType<EntityFieldFile['toJSON']>,
    parentFile: EntityFile,
  ): EntityFieldFile {
    return EntityFieldFile.create(
      omit(json, 'fileType') as EntityFieldFileMeta,
      parentFile,
    )
  }
}
