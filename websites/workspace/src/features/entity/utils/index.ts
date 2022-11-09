import { EntityRelation } from '@modou/core'

export const generateSourceHandle = (entityRelation: EntityRelation) =>
  `${entityRelation.sourceEntity}_${entityRelation.name}`

export const generateTargetHandle = (entityRelation: EntityRelation) =>
  `${entityRelation.targetEntity}_${entityRelation.targetName}`
