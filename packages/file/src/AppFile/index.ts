import { BaseFile, BaseFileMap, BaseFileMete } from '@modou/file/BaseFile'
import { EntityFile } from '@modou/file/EntityFile'
import { PageFile } from '@modou/file/PageFile'
import { FileTypeEnum } from '@modou/file/types'

export type AppFileMeta = BaseFileMete
interface FileMap extends BaseFileMap {
  readonly pages: PageFile[]
  readonly entities: EntityFile[]
}
export class AppFile extends BaseFile<FileMap, AppFileMeta> {
  protected constructor(meta: AppFileMeta) {
    super({ fileType: FileTypeEnum.App, meta })
  }

  static create(meta: AppFileMeta) {
    return new AppFile(meta)
  }

  fileMap: FileMap = {
    // TODO make it readonly
    pages: [],
    entities: [],
  }

  get pages() {
    return this.fileMap.pages
  }

  get entities() {
    return this.fileMap.entities
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.fileMapToJson(),
      fileType: this.fileType,
    }
  }

  static formJSON(json: ReturnType<AppFile['toJSON']>): AppFile {
    const appFile = AppFile.create({
      name: json.name,
      id: json.id,
      version: json.version,
    })
    const entities = json.entities.map((entity) =>
      EntityFile.formJSON(
        entity as unknown as ReturnType<EntityFile['toJSON']>,
      ),
    )
    const pages = json.pages.map((page) =>
      PageFile.formJSON(page as unknown as ReturnType<PageFile['toJSON']>),
    )
    appFile.fileMap.entities.push(...entities)
    appFile.fileMap.pages.push(...pages)
    return appFile
  }
}
