import { FieldEnum } from '../types'

export const getEntityTypeLabel = (fieldType: FieldEnum) => {
  switch (fieldType) {
    case FieldEnum.AutoNumber:
      return '自动编号'
    case FieldEnum.Date:
      return '日期'
    case FieldEnum.DateTime:
      return '日期时间'
    case FieldEnum.Number:
      return '数字'
    case FieldEnum.Email:
      return '邮箱'
    case FieldEnum.Enum:
      return '枚举'
    case FieldEnum.LongText:
      return '长文本'
    case FieldEnum.Text:
      return '单行文本'
    case FieldEnum.PhoneNumber:
      return '手机号'
    case FieldEnum.URL:
      return '网址'
    case FieldEnum.Image:
      return '图片'
    default:
      return '未知'
  }
}
