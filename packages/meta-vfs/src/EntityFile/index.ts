import { omit } from 'lodash'

import {
  action,
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
    super({ fileType: FileTypeEnum.Entity, meta, parentFile })
    makeObservable(this, {
      subFileMap: observable,
      entityFields: computed,
      entityRelations: computed,
      deleteEntityField: action,
    })
  }

  subFileMap: FileMap = {
    entityFields: [],
    entityRelations: [],
  }

  get entityFields() {
    return this.subFileMap.entityFields
  }

  deleteEntityField(entityFieldId: string) {
    const oldEntityFields = [...this.subFileMap.entityFields]
    this.subFileMap.entityFields.length = 0
    this.subFileMap.entityFields.push(
      ...oldEntityFields.filter((field) => field.meta.id !== entityFieldId),
    )
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

  // TODO 所有 version 提到 create 函数内部
  static create(meta: EntityFileMeta, parentFile: AppFile) {
    return runInAction(() => {
      const entityFile = new EntityFile(
        {
          ...meta,
          version: '0.0.1',
        },
        parentFile,
      )
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
