import { omit } from 'lodash'

import { makeObservable, observable, runInAction } from '@modou/reactivity'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { EntityFile } from '../EntityFile'
import { FileTypeEnum } from '../types'
import { EntityRelation } from './types'

export type EntityRelationFileMeta = BaseFileMete<EntityRelation>
export class EntityRelationFile extends BaseFile<
  {},
  EntityRelationFileMeta,
  EntityFile
> {
  protected constructor(meta: EntityRelationFileMeta, parentFile: EntityFile) {
    super({ fileType: FileTypeEnum.EntityRelation, meta, parentFile })
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

  static create(meta: EntityRelationFileMeta, parentFile: EntityFile) {
    return runInAction(() => {
      const entityRelationFile = new EntityRelationFile(meta, parentFile)
      parentFile.entityRelations.push(entityRelationFile)
      return entityRelationFile
    })
  }

  static formJSON(
    json: ReturnType<EntityRelationFile['toJSON']>,
    parentFile: EntityFile,
  ): EntityRelationFile {
    return EntityRelationFile.create(
      omit(json, 'fileType') as EntityRelationFileMeta,
      parentFile,
    )
  }
}
