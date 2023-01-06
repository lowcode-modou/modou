import { omit } from 'lodash'
import { makeObservable, observable } from 'mobx'

import { EntityField } from '@modou/core'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { FileTypeEnum } from '../types'

export type EntityFieldFileMeta = BaseFileMete<EntityField>
export class EntityFieldFile extends BaseFile<{}, EntityFieldFileMeta> {
  protected constructor(meta: EntityFieldFileMeta) {
    super({ fileType: FileTypeEnum.Widget, meta })
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

  static create(meta: EntityFieldFileMeta) {
    return new EntityFieldFile(meta)
  }

  static formJSON(
    json: ReturnType<EntityFieldFile['toJSON']>,
  ): EntityFieldFile {
    return EntityFieldFile.create(omit(json, 'fileType') as EntityFieldFileMeta)
  }
}
