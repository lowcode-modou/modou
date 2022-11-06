import { BaseEntityField, FieldEnum } from '../utils'

export interface NumberField extends BaseEntityField<FieldEnum.Number> {
  config: {
    max?: number
    min?: number
  }
}
