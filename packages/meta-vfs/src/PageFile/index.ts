import { omit } from 'lodash'
import { computed, makeObservable, observable, runInAction } from 'mobx'

import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { WidgetFile } from '../WidgetFile'
import { FileTypeEnum } from '../types'

export type PageFileMeta = BaseFileMete

interface FileMap extends BaseFileMap {
  readonly widgets: WidgetFile[]
}
export class PageFile extends BaseFile<FileMap, PageFileMeta> {
  protected constructor(meta: PageFileMeta) {
    super({ fileType: FileTypeEnum.App, meta })
    makeObservable(this, {
      subFileMap: observable,
      widgets: computed,
    })
  }

  subFileMap: FileMap = {
    widgets: [],
  }

  get widgets() {
    return this.subFileMap.widgets
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: PageFileMeta) {
    return new PageFile(meta)
  }

  static formJSON(json: ReturnType<PageFile['toJSON']>): PageFile {
    return runInAction(() => {
      const pageFile = PageFile.create(omit(json, ['fileType', 'widgets']))
      const widgets = json.widgets.map((widget) =>
        WidgetFile.formJSON(
          widget as unknown as ReturnType<WidgetFile['toJSON']>,
        ),
      )
      pageFile.subFileMap.widgets.push(...widgets)
      return pageFile
    })
  }
}
