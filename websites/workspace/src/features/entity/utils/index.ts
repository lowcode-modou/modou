import { CSSProperties } from 'react'

import {
  EntityFileMeta,
  EntityRelationFileMeta,
  EntityRelationLookupRelationTypeEnum,
  EntityRelationTypeEnum,
} from '@modou/meta-vfs'

export const generateSourceHandle = (entityRelation: EntityRelationFileMeta) =>
  `${entityRelation.sourceEntity}_${entityRelation.name}`

export const generateTargetHandle = (entityRelation: EntityRelationFileMeta) =>
  `${entityRelation.targetEntity}_${entityRelation.targetName}`

export const generateEntityDomId = (entity: EntityFileMeta) => {
  return `entity_er_node_id_${entity.id}`
}

export const generateEntityRelationDomId = (
  entity: EntityFileMeta,
  relation: EntityRelationFileMeta,
) => {
  return `${generateEntityDomId(entity)}_${relation.id}`
}

export const isLookupManyToOneRelation = (relation: EntityRelationFileMeta) => {
  return (
    relation.type === EntityRelationTypeEnum.Lookup &&
    relation.relationType === EntityRelationLookupRelationTypeEnum.ManyToOne
  )
}

export const getEntityRelationColor = (
  relation: EntityRelationFileMeta,
): CSSProperties['color'] => {
  if (relation.type === EntityRelationTypeEnum.Lookup) {
    return 'green'
  }
  return 'red'
}
