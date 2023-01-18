import { omit } from 'lodash'

import { WidgetBaseProps } from '@modou/core'
import { makeObservable, observable, runInAction } from '@modou/reactivity'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { PageFile } from '../PageFile'
import { FileTypeEnum } from '../types'

export type WidgetFileMeta = BaseFileMete<WidgetBaseProps>
export class WidgetFile extends BaseFile<{}, WidgetFileMeta, PageFile> {
  protected constructor(meta: WidgetFileMeta, parentFile: PageFile) {
    super({ fileType: FileTypeEnum.Widget, meta, parentFile })
    makeObservable(this, {
      subFileMap: observable,
    })
  }

  subFileMap = {}

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: Omit<WidgetFileMeta, 'version'>, parentFile: PageFile) {
    return runInAction(() => {
      const widgetFile = new WidgetFile(
        {
          ...meta,
          version: '0.0.1',
        },
        parentFile,
      )
      parentFile.widgets.push(widgetFile)
      return widgetFile
    })
  }

  static formJSON(
    json: ReturnType<WidgetFile['toJSON']>,
    parentFile: PageFile,
  ): WidgetFile {
    return WidgetFile.create(omit(json, 'fileType'), parentFile)
  }
}
