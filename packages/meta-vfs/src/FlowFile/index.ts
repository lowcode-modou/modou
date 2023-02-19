import { omit } from 'lodash'
import {
  Connection,
  type Edge,
  EdgeChange,
  type NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from 'reactflow'

import { FileTypeEnum, PageFile } from '@modou/meta-vfs'
import {
  action,
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
      reactFlowNodes: computed.struct,
      deleteNode: action,
      deleteEdge: action,
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

  get reactFlowNodes() {
    return this.flowNodes.map((n) => n.reactFlowMeta)
  }

  onReactFlowNodesChange = (changes: NodeChange[]) => {
    runInAction(() => {
      const res = applyNodeChanges<FlowNodeFile>(changes, this.reactFlowNodes)
      this.subFileMap.flowNodes.length = 0
      res.forEach((node) => {
        node.data.reactFlowMeta = node
        this.subFileMap.flowNodes.push(node.data)
      })
    })
  }

  get reactFlowEdges() {
    return this.flowEdges.map((e) => e.reactFlowMeta)
  }

  private readonly updateReactFlowEdges = (
    edges: Array<Edge<FlowEdgeFile>>,
  ) => {
    runInAction(() => {
      this.subFileMap.flowEdges.length = 0
      edges.forEach((edge) => {
        if (!edge.data) {
          edge.data = FlowEdgeFile.create(
            {
              name: '',
              id: edge.id,
              source: edge.source,
              sourceHandle: edge.sourceHandle!,
              target: edge.target,
              targetHandle: edge.targetHandle!,
            },
            this,
          )
        }
        this.subFileMap.flowEdges.push(edge.data)
      })
    })
  }

  deleteNode(nodeId: string) {
    const edges = this.subFileMap.flowEdges.filter(
      (edge) => edge.meta.target !== nodeId && edge.meta.source !== nodeId,
    )
    this.subFileMap.flowEdges.length = 0
    this.subFileMap.flowEdges.push(...edges)
    const nodes = this.subFileMap.flowNodes.filter(
      (node) => node.meta.id !== nodeId,
    )
    this.subFileMap.flowNodes.length = 0
    this.subFileMap.flowNodes.push(...nodes)
  }

  deleteEdge(edgeId: string) {
    const edges = this.subFileMap.flowEdges.filter(
      (edge) => edge.meta.id !== edgeId,
    )
    this.subFileMap.flowEdges.length = 0
    this.subFileMap.flowEdges.push(...edges)
  }

  onReactFlowEdgesChange = (changes: EdgeChange[]) => {
    const edges = applyEdgeChanges<FlowEdgeFile>(changes, this.reactFlowEdges)
    this.updateReactFlowEdges(edges)
  }

  onReactFlowConnect = (connection: Connection) => {
    const edges = addEdge(connection, this.reactFlowEdges)
    this.updateReactFlowEdges(edges)
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  // TODO 所有 version 提到 create 函数内部
  static create(meta: Omit<FlowFileMeta, 'version'>, parentFile: PageFile) {
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
