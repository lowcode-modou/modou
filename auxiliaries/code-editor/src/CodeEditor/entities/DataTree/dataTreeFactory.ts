import {
  ENTITY_TYPE,
  JSActionEntityConfig,
  JSActionEvalTree,
  WidgetConfig,
} from '@modou/code-editor/CodeEditor/entities/DataTree/types'
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

interface DataTreeAppsmith {
  ENTITY_TYPE: ENTITY_TYPE.APPSMITH
  user: {
    name: string
    age: number
  }
}

export interface WidgetEvalTree extends WidgetBaseProps {
  meta: Record<string, unknown>
  ENTITY_TYPE: ENTITY_TYPE.WIDGET
}

export interface DataTreeWidget extends WidgetEvalTree, WidgetConfig {}
export type DataTreeJSAction = JSActionEvalTree & JSActionEntityConfig

export type DataTreeObjectEntity =
  | DataTreeWidget
  | DataTreeAppsmith
  | DataTreeJSAction
// TODO 添加 DataTreeAction
// | DataTreeAction

// TODO 补全 ActionDispatcher
export type DataTreeEntity = DataTreeObjectEntity | Page[]
