import { LayoutOnLoadActionErrors } from '@modou/code-editor/CodeEditor/constants/AppsmithActionConstants/ActionConstants'

import { BaseAction, PluginType } from '../Action'

export interface Variable {
  name: string
  value: any
}
export interface JSCollection {
  id: string
  applicationId: string
  workspaceId: string
  name: string
  pageId: string
  pluginId: string
  pluginType: PluginType.JS
  actions: JSAction[]
  body: string
  variables: Variable[]
  userPermissions?: string[]
  errorReports?: LayoutOnLoadActionErrors[]
}

export interface JSActionConfig {
  body: string
  isAsync: boolean
  timeoutInMillisecond: number
  jsArguments: Variable[]
}
export interface JSAction extends BaseAction {
  actionConfiguration: JSActionConfig
  clientSideExecution: boolean
}
