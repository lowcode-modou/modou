import { CSSProperties } from 'react'

import {
  Entity,
  EntityRelation,
  EntityRelationLookupRelationTypeEnum,
} from '@modou/core'
import { EntityRelationTypeEnum } from '@modou/core/src/types/entity-relation'

export const generateSourceHandle = (entityRelation: EntityRelation) =>
  `${entityRelation.sourceEntity}_${entityRelation.name}`

export const generateTargetHandle = (entityRelation: EntityRelation) =>
  `${entityRelation.targetEntity}_${entityRelation.targetName}`

export const generateEntityDomId = (entity: Entity) => {
  return `entity_er_node_id_${entity.id}`
}

export const generateEntityRelationDomId = (
  entity: Entity,
  relation: EntityRelation,
) => {
  return `${generateEntityDomId(entity)}_${relation.id}`
}

export const isLookupManyToOneRelation = (relation: EntityRelation) => {
  return (
    relation.type === EntityRelationTypeEnum.Lookup &&
    relation.relationType === EntityRelationLookupRelationTypeEnum.ManyToOne
  )
}

export const getEntityRelationColor = (
  relation: EntityRelation,
): CSSProperties['color'] => {
  if (relation.type === EntityRelationTypeEnum.Lookup) {
    return 'green'
  }
  return 'red'
}
