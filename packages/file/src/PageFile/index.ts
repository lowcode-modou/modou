import { omit } from 'lodash'

import { BaseFile, BaseFileMap, BaseFileMete } from '@modou/file/BaseFile'
import { WidgetFile } from '@modou/file/WidgetFile'
import { FileTypeEnum } from '@modou/file/types'

export type PageFileMeta = BaseFileMete

interface FileMap extends BaseFileMap {
  readonly widgets: WidgetFile[]
}
export class PageFile extends BaseFile<FileMap, PageFileMeta> {
  protected constructor(meta: PageFileMeta) {
    super({ fileType: FileTypeEnum.App, meta })
  }

  fileMap: FileMap = {
    widgets: [],
  }

  get widgets() {
    return this.fileMap.widgets
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.fileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: PageFileMeta) {
    return new PageFile(meta)
  }

  static formJSON(json: ReturnType<PageFile['toJSON']>): PageFile {
    const pageFile = PageFile.create(omit(json, ['fileType', 'widgets']))
    const widgets = json.widgets.map((widget) =>
      WidgetFile.formJSON(
        widget as unknown as ReturnType<WidgetFile['toJSON']>,
      ),
    )
    pageFile.fileMap.widgets.push(...widgets)
    return pageFile
  }
}
