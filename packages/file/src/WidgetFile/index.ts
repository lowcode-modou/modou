import { omit } from 'lodash'

import { WidgetBaseProps } from '@modou/core'
import { BaseFile, BaseFileMete } from '@modou/file/BaseFile'
import { FileTypeEnum } from '@modou/file/types'

export type WidgetFileMeta = BaseFileMete<WidgetBaseProps>
export class WidgetFile extends BaseFile<{}, WidgetFileMeta> {
  protected constructor(meta: WidgetFileMeta) {
    super({ fileType: FileTypeEnum.Widget, meta })
  }

  fileMap = {}

  toJSON() {
    return {
      ...this.meta,
      ...this.fileMapToJson(),
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
