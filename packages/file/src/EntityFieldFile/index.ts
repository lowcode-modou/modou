import { omit } from 'lodash'
import { computed, makeObservable, observable } from 'mobx'

import { EntityField } from '@modou/core'
import { BaseFile, BaseFileMete } from '@modou/file/BaseFile'
import { FileTypeEnum } from '@modou/file/types'

export type EntityFieldFileMeta = BaseFileMete<EntityField>
export class EntityFieldFile extends BaseFile<{}, EntityFieldFileMeta> {
  protected constructor(meta: EntityFieldFileMeta) {
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

  static create(meta: EntityFieldFileMeta) {
    return new EntityFieldFile(meta)
  }

  static formJSON(
    json: ReturnType<EntityFieldFile['toJSON']>,
  ): EntityFieldFile {
    return EntityFieldFile.create(omit(json, 'fileType') as EntityFieldFileMeta)
  }
}
