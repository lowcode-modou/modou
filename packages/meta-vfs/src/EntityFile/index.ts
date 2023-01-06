import { omit } from 'lodash'
import { computed, makeObservable, observable, runInAction } from 'mobx'

import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { EntityFieldFile } from '../EntityFieldFile'
import { EntityRelationFile } from '../EntityRelationFile'
import { FileTypeEnum } from '../types'

export type EntityFileMeta = BaseFileMete<{
  readonly name: string
  title: string
  description: string
  // fields: EntityField[]
  // relations: EntityRelation[]
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
    makeObservable(this, {
      subFileMap: observable,
      entityFields: computed,
      entityRelations: computed,
    })
  }

  subFileMap: FileMap = {
    entityFields: [],
    entityRelations: [],
  }

  get entityFields() {
    return this.subFileMap.entityFields
  }

  get entityRelations() {
    return this.subFileMap.entityRelations
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: EntityFileMeta) {
    return new EntityFile(meta)
  }

  static formJSON(json: ReturnType<EntityFile['toJSON']>): EntityFile {
    return runInAction(() => {
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
      entityFile.subFileMap.entityFields.push(...entityFields)
      entityFile.subFileMap.entityRelations.push(...entityRelations)
      return entityFile
    })
  }
}
