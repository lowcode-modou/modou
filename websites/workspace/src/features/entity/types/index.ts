import { Entity, EntityRelation } from '@modou/core'

export interface EntityNodeData {
  entity: Entity
  passiveEntityRelations: EntityRelation[]
}
