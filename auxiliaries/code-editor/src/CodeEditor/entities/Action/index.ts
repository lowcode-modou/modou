import { LayoutOnLoadActionErrors } from '@modou/code-editor/CodeEditor/constants/AppsmithActionConstants/ActionConstants'
import { EmbeddedRestDatasource } from '@modou/code-editor/CodeEditor/entities/Datasource'
import { DynamicPath } from '@modou/code-editor/CodeEditor/utils/DynamicBindingUtils'

export enum PluginType {
  API = 'API',
  DB = 'DB',
  SAAS = 'SAAS',
  JS = 'JS',
  REMOTE = 'REMOTE',
}

export enum PluginName {
  MONGO = 'MongoDB',
}

export enum PluginPackageName {
  POSTGRES = 'postgres-plugin',
  MONGO = 'mongo-plugin',
  S3 = 'amazons3-plugin',
  GOOGLE_SHEETS = 'google-sheets-plugin',
  FIRESTORE = 'firestore-plugin',
  REST_API = 'restapi-plugin',
  GRAPHQL = 'graphql-plugin',
  JS = 'js-plugin',
}

export interface Property {
  key: string
  value: string
}

export interface BodyFormData {
  editable: boolean
  mandatory: boolean
  description: string
  key: string
  value?: string
  type: string
}

export interface ApiActionConfig extends Omit<ActionConfig, 'formData'> {
  headers: Property[]
  httpMethod: string
  path?: string
  body?: JSON | string | Record<string, any> | null
  encodeParamsToggle: boolean
  queryParameters?: Property[]
  bodyFormData?: BodyFormData[]
  formData: Record<string, unknown>
  query?: string | null
  variable?: string | null
}

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

export interface StoredDatasource {
  id: string
  pluginId?: string
}

export interface StoredDatasourceApiAction extends BaseApiAction {
  datasource: StoredDatasource
}

export interface QueryAction extends BaseAction {
  pluginType: PluginType.DB
  pluginName?: PluginName
  actionConfiguration: QueryActionConfig
  datasource: StoredDatasource
}

export interface QueryActionConfig extends ActionConfig {
  body?: string
}

export interface SaaSAction extends BaseAction {
  pluginType: PluginType.SAAS
  actionConfiguration: any
  datasource: StoredDatasource
}

export interface RemoteAction extends BaseAction {
  pluginType: PluginType.REMOTE
  actionConfiguration: any
  datasource: StoredDatasource
}

export type ApiAction = EmbeddedApiAction | StoredDatasourceApiAction
export type Action = ApiAction | QueryAction | SaaSAction | RemoteAction
