import { BaseEntityField, EntityFieldEnum } from '../utils'

export type EnumField = BaseEntityField<
  EntityFieldEnum.Enum,
  {
    enumCode: string
    multiple: boolean
  }
>
