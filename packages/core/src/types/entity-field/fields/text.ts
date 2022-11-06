import { BaseEntityField, FieldEnum } from '../utils'

export interface TextField extends BaseEntityField<FieldEnum.Text> {
  config: {
    max?: number
    min?: number
  }
}
