import { WidgetBaseProps } from '../widget'
import { EntityField } from './entity-field'
import { EntityRelation } from './entity-relation'

export type { EntityField } from './entity-field'
export type {
  EntityRelation,
  MasterDetailEntityRelation,
  LookupEntityRelation,
} from './entity-relation'

export {
  EntityRelationLookupRelationTypeEnum,
  EntityRelationMasterDetailRelationTypeEnum,
} from './entity-relation'

export { EntityFieldEnum } from './entity-field'

export interface App {
  id: string
  name: string
  pages: Page[]
  entities: Entity[]
}

export interface Page {
  id: string
  name: string
  widgets: WidgetBaseProps[]
  rootWidgetId: string
}

export interface Entity {
  id: string
  name: string
  title: string
  description: string
  fields: EntityField[]
  relations: EntityRelation[]
  position: {
    x: number
    y: number
  }
}

export enum WidgetGroupEnum {
  Button = 'Button',
  Input = 'Input',
  Container = 'Container',
}
