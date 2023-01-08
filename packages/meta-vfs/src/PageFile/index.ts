import { omit } from 'lodash'
import { computed, makeObservable, observable, runInAction } from 'mobx'

import { AppFile } from '../AppFile'
import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { WidgetFile } from '../WidgetFile'
import { FileTypeEnum } from '../types'

export interface PageFileMeta extends BaseFileMete {
  rootWidgetId: string
}

interface FileMap extends BaseFileMap {
  readonly widgets: WidgetFile[]
}
export class PageFile extends BaseFile<FileMap, PageFileMeta, AppFile> {
  protected constructor(meta: PageFileMeta, parentFile: AppFile) {
    super({ fileType: FileTypeEnum.App, meta, parentFile })
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

  static create(meta: PageFileMeta, parentFile: AppFile) {
    return runInAction(() => {
      const pageFile = new PageFile(meta, parentFile)
      parentFile.pages.push(pageFile)
      return pageFile
    })
  }

  static formJSON(
    json: ReturnType<PageFile['toJSON']>,
    parentFile: AppFile,
  ): PageFile {
    return runInAction(() => {
      const pageFile = PageFile.create(
        omit(json, ['fileType', 'widgets']),
        parentFile,
      )
      const widgets = json.widgets.map((widget) =>
        WidgetFile.formJSON(
          widget as unknown as ReturnType<WidgetFile['toJSON']>,
          pageFile,
        ),
      )
      pageFile.subFileMap.widgets.push(...widgets)
      return pageFile
    })
  }
}
