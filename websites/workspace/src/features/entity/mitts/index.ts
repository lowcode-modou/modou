import mitt from 'mitt'

import { Entity } from '@modou/core'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type EntityEvents = {
  onDelete: string
  onChange: Entity
}
export const entityEmitter = mitt<EntityEvents>()
