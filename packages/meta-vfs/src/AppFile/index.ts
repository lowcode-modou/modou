import { computed, makeObservable, observable, runInAction } from 'mobx'

import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { EntityFile } from '../EntityFile'
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
      entities: computed,
      pages: computed,
    })
  }

  subFileMap: FileMap = {
    // TODO make it readonly
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

  get entities() {
    return this.subFileMap.entities
  }

  set entities(entities) {
    runInAction(() => {
      this.subFileMap.entities.length = 0
      this.subFileMap.entities.push(...entities)
    })
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
      const entities = json.entities.map((entity) =>
        EntityFile.formJSON(
          entity as unknown as ReturnType<EntityFile['toJSON']>,
          appFile,
        ),
      )
      const pages = json.pages.map((page) =>
        PageFile.formJSON(
          page as unknown as ReturnType<PageFile['toJSON']>,
          appFile,
        ),
      )
      runInAction(() => {
        appFile.subFileMap.entities.push(...entities)
        appFile.subFileMap.pages.push(...pages)
      })
      return appFile
    })
  }
}
