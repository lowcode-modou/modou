import { BaseEntityField, EntityFieldEnum } from '../utils'

export type TextField = BaseEntityField<
  EntityFieldEnum.Text,
  {
    max?: number
    min?: number
  }
>
