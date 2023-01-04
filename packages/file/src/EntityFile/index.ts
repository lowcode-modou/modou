import { omit } from 'lodash'

import { EntityField, EntityRelation } from '@modou/core'
import { BaseFile, BaseFileMap, BaseFileMete } from '@modou/file/BaseFile'
import { EntityFieldFile } from '@modou/file/EntityFieldFile'
import { EntityRelationFile } from '@modou/file/EntityRelationFile'
import { FileTypeEnum } from '@modou/file/types'

export type EntityFileMeta = BaseFileMete<{
  readonly name: string
  title: string
  description: string
  fields: EntityField[]
  relations: EntityRelation[]
  position: {
    x: number
    y: number
  }
}>

interface FileMap extends BaseFileMap {
  readonly entityFields: EntityFieldFile[]
  readonly entityRelations: EntityRelationFile[]
}
export class EntityFile extends BaseFile<FileMap, EntityFileMeta> {
  protected constructor(meta: EntityFileMeta) {
    super({ fileType: FileTypeEnum.Widget, meta })
  }

  fileMap: FileMap = {
    entityFields: [],
    entityRelations: [],
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.fileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: EntityFileMeta) {
    return new EntityFile(meta)
  }

  static formJSON(json: ReturnType<EntityFile['toJSON']>): EntityFile {
    const entityFile = EntityFile.create(
      omit(json, ['fileType', 'entityFields', 'entityRelations']),
    )
    const entityFields = json.entityFields.map((entityField) =>
      EntityFieldFile.formJSON(
        entityField as unknown as ReturnType<EntityFieldFile['toJSON']>,
      ),
    )
    const entityRelations = json.entityRelations.map((entityRelation) =>
      EntityRelationFile.formJSON(
        entityRelation as unknown as ReturnType<EntityRelationFile['toJSON']>,
      ),
    )
    entityFile.fileMap.entityFields.push(...entityFields)
    entityFile.fileMap.entityRelations.push(...entityRelations)
    return entityFile
  }
}
