import { omit } from 'lodash'

import {
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'

import { AppFile } from '../AppFile'
import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { EntityFieldFile } from '../EntityFieldFile'
import { EntityRelationFile } from '../EntityRelationFile'
import { FileTypeEnum } from '../types'

export type EntityFileMeta = BaseFileMete<{
  readonly name: string
  title: string
  description: string
  position: {
    x: number
    y: number
  }
}>

interface FileMap extends BaseFileMap {
  readonly entityFields: EntityFieldFile[]
  readonly entityRelations: EntityRelationFile[]
}
export class EntityFile extends BaseFile<FileMap, EntityFileMeta, AppFile> {
  protected constructor(meta: EntityFileMeta, parentFile: AppFile) {
    super({ fileType: FileTypeEnum.Widget, meta, parentFile })
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

  static create(meta: EntityFileMeta, parentFile: AppFile) {
    return runInAction(() => {
      const entityFile = new EntityFile(meta, parentFile)
      parentFile.entities.push(entityFile)
      return entityFile
    })
  }

  static formJSON(
    json: ReturnType<EntityFile['toJSON']>,
    parentFile: AppFile,
  ): EntityFile {
    return runInAction(() => {
      const entityFile = EntityFile.create(
        omit(json, ['fileType', 'entityFields', 'entityRelations']),
        parentFile,
      )
      const entityFields = json.entityFields.map((entityField) =>
        EntityFieldFile.formJSON(
          entityField as unknown as ReturnType<EntityFieldFile['toJSON']>,
          entityFile,
        ),
      )
      const entityRelations = json.entityRelations.map((entityRelation) =>
        EntityRelationFile.formJSON(
          entityRelation as unknown as ReturnType<EntityRelationFile['toJSON']>,
          entityFile,
        ),
      )
      entityFile.subFileMap.entityFields.push(...entityFields)
      entityFile.subFileMap.entityRelations.push(...entityRelations)
      return entityFile
    })
  }
}
