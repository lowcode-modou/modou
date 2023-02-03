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
> extends BaseFile<{}, T, FlowFile> {
  constructor(meta: T, parentFile: FlowFile) {
    super({
      fileType: FileTypeEnum.FlowNode,
      meta,
      parentFile,
    })
    makeObservable(this, {
      subFileMap: observable,
      tempMeta: observable,
      reactFlowMeta: computed.struct,
    })
  }

  // TODO 添加 private 参考mobx文档  是支持的
  tempMeta: Partial<Node> = {}
  get reactFlowMeta(): Node {
    return {
      ...this.tempMeta,
      id: this.meta.id,
      type: this.meta.type,
      position: this.meta.position,
      data: this,
    }
  }

  set reactFlowMeta(node: Node) {
    runInAction(() => {
      this.meta.position = node.position
      this.tempMeta = node
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
