import { omit } from 'lodash'

import { FlowNodeBaseProps } from '@modou/core'
import { FileTypeEnum } from '@modou/meta-vfs'
import { makeObservable, observable, runInAction } from '@modou/reactivity'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { FlowFile } from '../FlowFile'

export type FlowNodeFileMeta<T extends FlowNodeBaseProps = FlowNodeBaseProps> =
  BaseFileMete<T>

export class FlowNodeFile extends BaseFile<{}, FlowNodeFileMeta, FlowFile> {
  constructor(meta: FlowNodeFileMeta, parentFile: FlowFile) {
    super({
      fileType: FileTypeEnum.FlowNode,
      meta,
      parentFile,
    })
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

  static create(
    meta: Omit<FlowNodeBaseProps, 'version'>,
    parentFile: FlowFile,
  ) {
    return runInAction(() => {
      const entityFieldFile = new FlowNodeFile(
        {
          ...meta,
          version: '0.0.1',
          // FIXME ts type
        } as unknown as FlowNodeFileMeta,
        parentFile,
      )
      parentFile.flowNodes.push(entityFieldFile)
      return entityFieldFile
    })
  }

  static formJSON(
    json: ReturnType<FlowNodeFile['toJSON']>,
    parentFile: FlowFile,
  ): FlowNodeFile {
    return FlowNodeFile.create(
      omit(json, 'fileType') as FlowNodeFileMeta,
      parentFile,
    )
  }
}
