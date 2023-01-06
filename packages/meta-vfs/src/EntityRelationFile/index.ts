import { omit } from 'lodash'
import { makeObservable, observable } from 'mobx'

import { EntityRelation } from '@modou/core'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { FileTypeEnum } from '../types'

export type EntityRelationFileMeta = BaseFileMete<EntityRelation>
export class EntityRelationFile extends BaseFile<{}, EntityRelationFileMeta> {
  protected constructor(meta: EntityRelationFileMeta) {
    super({ fileType: FileTypeEnum.Widget, meta })
    makeObservable(this, {
      subFileMapToJson: observable,
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

  static create(meta: EntityRelationFileMeta) {
    return new EntityRelationFile(meta)
  }

  static formJSON(
    json: ReturnType<EntityRelationFile['toJSON']>,
  ): EntityRelationFile {
    return EntityRelationFile.create(
      omit(json, 'fileType') as EntityRelationFileMeta,
    )
  }
}
