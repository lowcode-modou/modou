import { omit } from 'lodash'
import { makeObservable, observable } from 'mobx'

import { WidgetBaseProps } from '@modou/core'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { FileTypeEnum } from '../types'

export type WidgetFileMeta = BaseFileMete<WidgetBaseProps>
export class WidgetFile extends BaseFile<{}, WidgetFileMeta> {
  protected constructor(meta: WidgetFileMeta) {
    super({ fileType: FileTypeEnum.Widget, meta })
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

  static create(meta: WidgetFileMeta) {
    return new WidgetFile(meta)
  }

  static formJSON(json: ReturnType<WidgetFile['toJSON']>): WidgetFile {
    return WidgetFile.create(omit(json, 'fileType'))
  }
}
