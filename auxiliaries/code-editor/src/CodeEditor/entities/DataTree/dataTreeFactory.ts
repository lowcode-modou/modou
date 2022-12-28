import { AppTheme } from '@modou/code-editor/CodeEditor/entities/AppTheming'
import {
  ActionEntityConfig,
  ActionEntityEvalTree,
  ENTITY_TYPE,
  JSActionEntityConfig,
  JSActionEvalTree,
  WidgetConfig,
} from '@modou/code-editor/CodeEditor/entities/DataTree/types'
import { AppDataState } from '@modou/code-editor/CodeEditor/reducers/entityReducers/appReducer'
import { WidgetConfigProps } from '@modou/code-editor/CodeEditor/reducers/entityReducers/widgetConfigReducer'
import { WidgetProps } from '@modou/code-editor/CodeEditor/widgets/BaseWidget'
import { WidgetBaseProps } from '@modou/core'

interface Page {
  pageName: string
  pageId: string
  isDefault: boolean
  latest?: boolean
  isHidden?: boolean
  slug: string
  customSlug?: string
  userPermissions?: string[]
}

export interface DataTreeAppsmith extends Omit<AppDataState, 'store'> {
  ENTITY_TYPE: ENTITY_TYPE.APPSMITH
  store: Record<string, unknown>
  theme: AppTheme['properties']
}

export interface WidgetEvalTree extends WidgetBaseProps {
  meta: Record<string, unknown>
  ENTITY_TYPE: ENTITY_TYPE.WIDGET
}

export interface DataTreeWidget extends WidgetEvalTree, WidgetConfig {}
export type DataTreeJSAction = JSActionEvalTree & JSActionEntityConfig

export interface DataTreeAction
  extends ActionEntityEvalTree,
    ActionEntityConfig {}

export type DataTreeObjectEntity =
  | DataTreeWidget
  | DataTreeAppsmith
  | DataTreeJSAction
  | DataTreeAction

// TODO 补全 ActionDispatcher
export type DataTreeEntity = DataTreeObjectEntity | Page[]
export interface WidgetEntityConfig
  extends Partial<WidgetProps>,
    Omit<WidgetConfigProps, 'widgetName' | 'rows' | 'columns'>,
    WidgetConfig {
  defaultMetaProps: string[]
  type: string
}
export interface UnEvalTreeAction extends ActionEntityEvalTree {
  __config__: ActionEntityConfig
}
export interface UnEvalTreeJSAction extends JSActionEvalTree {
  __config__: JSActionEntityConfig
}
export interface UnEvalTreeWidget extends WidgetEvalTree {
  __config__: WidgetEntityConfig
}
export type UnEvalTreeEntityObject =
  | UnEvalTreeAction
  | UnEvalTreeJSAction
  | UnEvalTreeWidget

export type UnEvalTreeEntity =
  | UnEvalTreeEntityObject
  | DataTreeAppsmith
  | Page[]

export type UnEvalTree = {
  [entityName: string]: UnEvalTreeEntity
}
