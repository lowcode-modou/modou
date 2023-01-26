import { WidgetBaseProps } from '@modou/core'

import { ENTITY_TYPE } from './editor-config'

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

interface DataTreeMoDou {
  ENTITY_TYPE: ENTITY_TYPE.MDOUDOU
  user: {
    name: string
    age: number
  }
}

export interface WidgetEvalTree extends WidgetBaseProps {
  meta: Record<string, unknown>
  ENTITY_TYPE: ENTITY_TYPE.WIDGET
}

interface DataTreeWidget extends WidgetEvalTree {}

export type DataTreeObjectEntity = DataTreeWidget | DataTreeMoDou

export type DataTreeEntity = DataTreeObjectEntity | Page[]
