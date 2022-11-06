import { BaseEntityField, FieldEnum } from '../utils'

export interface LongTextField extends BaseEntityField<FieldEnum.LongText> {
  config: {
    max?: number
    min?: number
  }
}
