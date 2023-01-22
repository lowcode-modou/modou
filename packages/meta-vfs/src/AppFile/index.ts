import { isArray, keyBy } from 'lodash'

import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'

import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { EntityFile } from '../EntityFile'
import { EntityRelationFile } from '../EntityRelationFile'
import { PageFile } from '../PageFile'
import { FileTypeEnum } from '../types'

export type AppFileMeta = BaseFileMete
interface FileMap extends BaseFileMap {
  readonly pages: PageFile[]
  readonly entities: EntityFile[]
}
export class AppFile extends BaseFile<FileMap, AppFileMeta, null> {
  protected constructor(meta: AppFileMeta) {
    super({ fileType: FileTypeEnum.App, meta, parentFile: null })
    makeObservable(this, {
      subFileMap: observable,
      entities: computed.struct,
      pages: computed.struct,
      entityMap: computed.struct,
      entityRelationMap: computed.struct,
      entityRelationsByTargetEntityNameMap: computed.struct,
      entityRelationsBySourceEntityNameMap: computed.struct,
      deleteEntity: action,
      deletePage: action,
    })

    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', () => {
        if (this.meta.id) {
          window.localStorage.removeItem(this.meta.id)
          window.localStorage.setItem(
            this.meta.id,
            JSON.stringify(this.toJSON()),
          )
        }
      })
    }
  }

  subFileMap: FileMap = {
    pages: [],
    entities: [],
  }

  get pages() {
    return this.subFileMap.pages
  }

  set pages(pages) {
    runInAction(() => {
      this.subFileMap.pages.length = 0
      this.subFileMap.pages.push(...pages)
    })
  }

  deletePage(pageId: string) {
    const oldPages = [...this.subFileMap.pages]
    this.subFileMap.pages.length = 0
    this.subFileMap.pages.push(
      ...oldPages.filter((page) => page.meta.id !== pageId),
    )
  }

  get entities() {
    return this.subFileMap.entities
  }

  set entities(entities) {
    runInAction(() => {
      this.subFileMap.entities.length = 0
      this.subFileMap.entities.push(...entities)
    })
  }

  get entityMap() {
    return keyBy(this.entities, (entity) => entity.meta.id)
  }

  deleteEntity(entityId: string) {
    const oldEntities = [...this.subFileMap.entities]
    this.subFileMap.entities.length = 0
    this.subFileMap.entities.push(
      ...oldEntities.filter((entity) => entity.meta.id !== entityId),
    )
  }

  get entityRelationMap() {
    return this.entities.reduce<Record<string, EntityRelationFile>>(
      (pre, cur) => ({
        ...pre,
        ...keyBy(
          cur.subFileMap.entityRelations,
          (relation) => relation.meta.id,
        ),
      }),
      {},
    )
  }

  get entityRelationsByTargetEntityNameMap() {
    return Object.values(this.entityRelationMap).reduce<
      Record<string, EntityRelationFile[]>
    >((pre, cur) => {
      // TODO 如果是ManyToOne 的 Lookup 则不在对方双向生成关系
      // if (
      //   cur.type === EntityRelationTypeEnum.Lookup &&
      //   cur.relationType === EntityRelationLookupRelationTypeEnum.ManyToOne
      // ) {
      //   return pre
      // }
      const targetEntityName = cur.meta.targetEntity
      if (!isArray(pre[targetEntityName])) {
        pre[targetEntityName] = []
      }
      pre[targetEntityName].push(cur)
      return pre
    }, {})
  }

  get entityRelationsBySourceEntityNameMap() {
    return Object.values(this.entityRelationMap).reduce<
      Record<string, EntityRelationFile[]>
    >((pre, cur) => {
      const sourceEntityName = cur.meta.sourceEntity
      if (!isArray(pre[sourceEntityName])) {
        pre[sourceEntityName] = []
      }
      pre[sourceEntityName].push(cur)
      return pre
    }, {})
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: AppFileMeta) {
    return new AppFile(meta)
  }

  static formJSON(json: ReturnType<AppFile['toJSON']>): AppFile {
    return runInAction(() => {
      const appFile = AppFile.create({
        name: json.name,
        id: json.id,
        version: json.version,
      })
      json.entities.map((entity) =>
        EntityFile.formJSON(
          entity as unknown as ReturnType<EntityFile['toJSON']>,
          appFile,
        ),
      )
      json.pages.map((page) =>
        PageFile.formJSON(
          page as unknown as ReturnType<PageFile['toJSON']>,
          appFile,
        ),
      )
      return appFile
    })
  }

  static formLocal(appId: string) {
    const appMeta = JSON.parse(
      localStorage.getItem(appId) ?? '{}',
    ) as unknown as ReturnType<AppFile['toJSON']>
    return this.formJSON(appMeta)
  }
}
