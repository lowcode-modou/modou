// Lookup ManyToMany
// MaterDetail ManyToOne OneToOne

export enum EntityRelationTypeEnum {
  MasterDetail = 'MasterDetail',
  Lookup = 'Lookup',
}

export enum EntityRelationMasterDetailRelationTypeEnum {
  ManyToOne = 'ManyToOne',
  OneToOne = 'OneToOne',
}

export enum EntityRelationLookupRelationTypeEnum {
  ManyToMany = 'ManyToMany',
  ManyToOne = 'ManyToOne',
}

interface BaseEntityRelation<Type extends EntityRelationTypeEnum> {
  id: string
  name: string
  title: string
  description: string
  sourceEntity: string
  targetEntity: string
  type: Type
  targetName: string
  targetTitle: string
  targetDescription: string
}

export interface MasterDetailEntityRelation
  extends BaseEntityRelation<EntityRelationTypeEnum.MasterDetail> {
  relationType: EntityRelationMasterDetailRelationTypeEnum
}

export interface LookupEntityRelation
  extends BaseEntityRelation<EntityRelationTypeEnum.Lookup> {
  relationType: EntityRelationLookupRelationTypeEnum
}

export type EntityRelation = MasterDetailEntityRelation | LookupEntityRelation
