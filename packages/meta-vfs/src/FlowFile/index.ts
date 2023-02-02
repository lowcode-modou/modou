import { omit } from 'lodash'

import { FileTypeEnum, PageFile } from '@modou/meta-vfs'
import {
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'

import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { FlowEdgeFile } from '../FlowEdgeFile'
import { FlowNodeFile } from '../FlowNodeFile'

export type FlowFileMeta = BaseFileMete<{
  readonly name: string
}>

interface FileMap extends BaseFileMap {
  readonly flowNodes: FlowNodeFile[]
  readonly flowEdges: FlowEdgeFile[]
}

export class FlowFile extends BaseFile<FileMap, FlowFileMeta, PageFile> {
  protected constructor(meta: FlowFileMeta, parentFile: PageFile) {
    super({ fileType: FileTypeEnum.Flow, meta, parentFile })
    makeObservable(this, {
      subFileMap: observable,
      flowNodes: computed,
      flowEdges: computed,
    })
  }

  subFileMap: FileMap = {
    flowNodes: [],
    flowEdges: [],
  }

  get flowNodes() {
    return this.subFileMap.flowNodes
  }

  get flowEdges() {
    return this.subFileMap.flowEdges
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  // TODO 所有 version 提到 create 函数内部
  static create(meta: FlowFileMeta, parentFile: PageFile) {
    return runInAction(() => {
      const flowFile = new FlowFile(
        {
          ...meta,
          version: '0.0.1',
        },
        parentFile,
      )
      parentFile.flows.push(flowFile)
      return flowFile
    })
  }

  static formJSON(
    json: ReturnType<FlowFile['toJSON']>,
    parentFile: PageFile,
  ): FlowFile {
    return runInAction(() => {
      const flowFile = FlowFile.create(
        omit(json, ['fileType', 'flowNodes']),
        parentFile,
      )
      json.flowNodes.map((flowNode) =>
        FlowNodeFile.formJSON(
          flowNode as unknown as ReturnType<FlowNodeFile['toJSON']>,
          flowFile,
        ),
      )
      json.flowEdges.map((flowEdge) =>
        FlowEdgeFile.formJSON(
          flowEdge as unknown as ReturnType<FlowEdgeFile['toJSON']>,
          flowFile,
        ),
      )
      return flowFile
    })
  }
}
