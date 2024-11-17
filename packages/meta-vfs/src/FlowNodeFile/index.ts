import { omit } from 'lodash'
import { type Node } from 'reactflow'

import { FlowNodeBaseProps } from '@modou/core'
import { FileTypeEnum } from '@modou/meta-vfs'
import {
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { FlowFile } from '../FlowFile'

export type FlowNodeFileMeta<T extends FlowNodeBaseProps = FlowNodeBaseProps> =
  BaseFileMete<T>

export class FlowNodeFile<
  T extends FlowNodeFileMeta = FlowNodeFileMeta,
> extends BaseFile<{}, T, null> {
  constructor(meta: T, parentFile: null) {
    super({
      fileType: FileTypeEnum.FlowNode,
      meta,
      parentFile,
      subFileTypes: [],
    })
  }
  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(
    meta: Omit<FlowNodeBaseProps, 'version'>,
    // parentFile: null,
  ) {
    const entityFieldFile = new FlowNodeFile(
      {
        ...meta,
        version: '0.0.1',
        // FIXME ts type
      } as unknown as FlowNodeFileMeta,
      null,
    )
    // parentFile.flowNodes.push(entityFieldFile)
    return entityFieldFile
  }

  static formJSON(
    json: ReturnType<FlowNodeFile['toJSON']>,
    parentFile: FlowFile,
  ): FlowNodeFile {
    return FlowNodeFile.create(
      omit(json, 'fileType') as FlowNodeFileMeta,
      // parentFile,
    )
  }
}
