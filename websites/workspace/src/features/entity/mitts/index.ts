import mitt from 'mitt'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type EntityEvents = {
  onDelete: string
  onClickEditEntity: string
}
export const entityEmitter = mitt<EntityEvents>()
