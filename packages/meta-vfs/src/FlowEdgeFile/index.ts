import { omit } from 'lodash'
import { Edge } from 'reactflow'

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

  // TODO 添加 private 参考mobx文档  是支持的

  tempMeta: Partial<Edge> = {}
  get reactFlowMeta(): Edge {
    return {
      ...this.tempMeta,
      ...this.meta,
      data: this,
    }
  }

  set reactFlowMeta(edge: Edge) {
    runInAction(() => {
      this.meta.source = edge.source
      this.meta.target = edge.target
      this.meta.sourceHandle = edge.sourceHandle!
      this.meta.targetHandle = edge.targetHandle!
      this.tempMeta = edge
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