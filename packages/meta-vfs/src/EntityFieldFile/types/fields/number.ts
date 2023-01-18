import { BaseEntityField, EntityFieldEnum } from '../utils'

export type NumberField = BaseEntityField<
  EntityFieldEnum.Number,
  {
    max?: number
    min?: number
  }
>
