import { BaseEntityField, EntityFieldEnum } from '../utils'

export type LongTextField = BaseEntityField<
  EntityFieldEnum.LongText,
  {
    max?: number
    min?: number
  }
>
