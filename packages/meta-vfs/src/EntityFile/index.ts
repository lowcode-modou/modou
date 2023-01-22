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
import { EntityFieldEnum, FileTypeEnum } from '../types'

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

  static getEntityFieldTypeLabel = (fieldType: EntityFieldEnum) => {
    switch (fieldType) {
      case EntityFieldEnum.AutoNumber:
        return '自动编号'
      case EntityFieldEnum.Date:
        return '日期'
      case EntityFieldEnum.DateTime:
        return '日期时间'
      case EntityFieldEnum.Number:
        return '数字'
      case EntityFieldEnum.Email:
        return '邮箱'
      case EntityFieldEnum.Enum:
        return '枚举'
      case EntityFieldEnum.LongText:
        return '长文本'
      case EntityFieldEnum.Text:
        return '单行文本'
      case EntityFieldEnum.PhoneNumber:
        return '手机号'
      case EntityFieldEnum.URL:
        return '网址'
      case EntityFieldEnum.Image:
        return '图片'
      default:
        return '未知'
    }
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
      json.entityFields.map((entityField) =>
        EntityFieldFile.formJSON(
          entityField as unknown as ReturnType<EntityFieldFile['toJSON']>,
          entityFile,
        ),
      )
      json.entityRelations.map((entityRelation) =>
        EntityRelationFile.formJSON(
          entityRelation as unknown as ReturnType<EntityRelationFile['toJSON']>,
          entityFile,
        ),
      )
      return entityFile
    })
  }
}
