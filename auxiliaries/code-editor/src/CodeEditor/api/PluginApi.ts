import {
  PluginPackageName,
  PluginType,
} from '@modou/code-editor/CodeEditor/entities/Action'
import { DependencyMap } from '@modou/code-editor/CodeEditor/utils/DynamicBindingUtils'

export type PluginId = string
export enum UIComponentTypes {
  DbEditorForm = 'DbEditorForm',
  UQIDbEditorForm = 'UQIDbEditorForm',
  ApiEditorForm = 'ApiEditorForm',
  RapidApiEditorForm = 'RapidApiEditorForm',
  JsEditorForm = 'JsEditorForm',
}

export enum DatasourceComponentTypes {
  RestAPIDatasourceForm = 'RestAPIDatasourceForm',
  AutoForm = 'AutoForm',
}

export interface Plugin {
  id: string
  name: string
  type: PluginType
  packageName: PluginPackageName
  iconLocation?: string
  uiComponent: UIComponentTypes
  datasourceComponent: DatasourceComponentTypes
  allowUserDatasources?: boolean
  templates: Record<string, string>
  responseType?: 'TABLE' | 'JSON'
  documentationLink?: string
  generateCRUDPageComponent?: string
}

export interface PluginFormPayload {
  form: any[]
  editor: any[]
  setting: any[]
  dependencies: DependencyMap
  formButton: string[]
}

export interface DefaultPlugin {
  id: string
  name: string
  packageName: string
  iconLocation?: string
  allowUserDatasources?: boolean
}
