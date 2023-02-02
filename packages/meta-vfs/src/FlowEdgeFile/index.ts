import { omit } from 'lodash'

import { FileTypeEnum } from '@modou/meta-vfs'
import { makeObservable, observable, runInAction } from '@modou/reactivity'

import { BaseFile, BaseFileMete } from '../BaseFile'
import { FlowFile } from '../FlowFile'

export type FlowEdgeFileMeta = BaseFileMete<{
  id: string
  source: string
  target: string
  sourceHandle: string
  targetHandle: string
}>
export class FlowEdgeFile extends BaseFile<{}, FlowEdgeFileMeta, FlowFile> {
  constructor(meta: FlowEdgeFileMeta, parentFile: FlowFile) {
    super({
      fileType: FileTypeEnum.FlowEdge,
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

  static create(meta: Omit<FlowEdgeFileMeta, 'version'>, parentFile: FlowFile) {
    return runInAction(() => {
      const flowEdgeFile = new FlowEdgeFile(
        {
          ...meta,
          version: '0.0.1',
          // FIXME ts type
        } as unknown as FlowEdgeFileMeta,
        parentFile,
      )
      parentFile.flowEdges.push(flowEdgeFile)
      return flowEdgeFile
    })
  }

  static formJSON(
    json: ReturnType<FlowEdgeFile['toJSON']>,
    parentFile: FlowFile,
  ): FlowEdgeFile {
    return FlowEdgeFile.create(
      omit(json, 'fileType') as FlowEdgeFileMeta,
      parentFile,
    )
  }
}
