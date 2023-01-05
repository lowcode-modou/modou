import { omit } from 'lodash'
import { computed, makeObservable, observable } from 'mobx'

import { EntityRelation } from '@modou/core'
import { BaseFile, BaseFileMete } from '@modou/file/BaseFile'
import { FileTypeEnum } from '@modou/file/types'

export type EntityRelationFileMeta = BaseFileMete<EntityRelation>
export class EntityRelationFile extends BaseFile<{}, EntityRelationFileMeta> {
  protected constructor(meta: EntityRelationFileMeta) {
    super({ fileType: FileTypeEnum.Widget, meta })
    makeObservable(this, {
      fileMap: observable,
    })
  }

  fileMap = {}

  toJSON() {
    return {
      ...this.meta,
      ...this.fileMapToJson(),
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
