import { DynamicPath } from '@modou/code-editor/CodeEditor/utils/DynamicBindingUtils'

export interface LimitOffset {
  limit: Record<string, unknown>
  offset: Record<string, unknown>
}
export interface SelfReferencingData {
  limitBased?: LimitOffset
  curserBased?: {
    previous?: LimitOffset
    next?: LimitOffset
  }
}
export enum PaginationType {
  NONE = 'NONE',
  PAGE_NO = 'PAGE_NO',
  URL = 'URL',
  CURSOR = 'CURSOR',
}
export interface KeyValuePair {
  key?: string
  value?: unknown
}
export interface ActionConfig {
  timeoutInMillisecond?: number
  paginationType?: PaginationType
  formData?: Record<string, unknown>
  pluginSpecifiedTemplates?: KeyValuePair[]
  path?: string
  queryParameters?: KeyValuePair[]
  selfReferencingData?: SelfReferencingData
}

export interface BaseAction {
  id: string
  name: string
  workspaceId: string
  pageId: string
  collectionId?: string
  pluginId: string
  executeOnLoad: boolean
  dynamicBindingPathList: DynamicPath[]
  isValid: boolean
  invalids: string[]
  jsonPathKeys: string[]
  cacheResponse: string
  confirmBeforeExecute?: boolean
  eventData?: any
  messages: string[]
  userPermissions?: string[]
  errorReports?: LayoutOnLoadActionErrors[]
}

interface BaseApiAction extends BaseAction {
  pluginType: PluginType.API
  actionConfiguration: ApiActionConfig
}
export interface EmbeddedApiAction extends BaseApiAction {
  datasource: EmbeddedRestDatasource
}
export type ApiAction = EmbeddedApiAction | StoredDatasourceApiAction
export type Action = ApiAction | QueryAction | SaaSAction | RemoteAction
