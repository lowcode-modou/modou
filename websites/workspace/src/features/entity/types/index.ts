import { EntityFile, EntityRelationFile } from '@modou/meta-vfs'

export interface EntityNodeData {
  entity: EntityFile
  passiveEntityRelations: EntityRelationFile[]
}
