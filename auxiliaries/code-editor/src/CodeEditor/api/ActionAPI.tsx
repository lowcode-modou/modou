import { HttpMethod } from '@modou/code-editor/CodeEditor/api/Api'
import { WidgetType } from '@modou/code-editor/CodeEditor/constants/WidgetConstants'

export interface SuggestedWidget {
  type: WidgetType
  bindingQuery: string
}
export interface ActionApiResponseReq {
  headers: Record<string, string[]>
  body: Record<string, unknown> | null
  httpMethod: HttpMethod | ''
  url: string
}
export interface ActionResponse {
  body: unknown
  headers: Record<string, string[]>
  request?: ActionApiResponseReq
  statusCode: string
  dataTypes: Array<Record<string, string>>
  duration: string
  size: string
  isExecutionSuccess?: boolean
  suggestedWidgets?: SuggestedWidget[]
  messages?: string[]
  errorType?: string
  readableError?: string
  responseDisplayFormat?: string
}
