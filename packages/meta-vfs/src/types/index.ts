import { PageFileMeta } from '../PageFile'

export enum FileTypeEnum {
  App = 'App',
  Page = 'Page',
  Widget = 'Widget',
  View = 'View',
  Entity = 'Entity',
  EntityRelation = 'EntityRelation',
  EntityField = 'EntityField',
  Flow = 'Flow',
  FlowNode = 'FlowNode',
  FlowEdge = 'FlowEdge',
}

export type UpdateParams<T extends object> = ((meta: T) => T) | T
