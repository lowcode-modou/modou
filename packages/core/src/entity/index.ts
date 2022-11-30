import { EntityFieldEnum } from '../types'

export const getEntityFieldTypeLabel = (fieldType: EntityFieldEnum) => {
  switch (fieldType) {
    case EntityFieldEnum.AutoNumber:
      return '自动编号'
    case EntityFieldEnum.Date:
      return '日期'
    case EntityFieldEnum.DateTime:
      return '日期时间'
    case EntityFieldEnum.Number:
      return '数字'
    case EntityFieldEnum.Email:
      return '邮箱'
    case EntityFieldEnum.Enum:
      return '枚举'
    case EntityFieldEnum.LongText:
      return '长文本'
    case EntityFieldEnum.Text:
      return '单行文本'
    case EntityFieldEnum.PhoneNumber:
      return '手机号'
    case EntityFieldEnum.URL:
      return '网址'
    case EntityFieldEnum.Image:
      return '图片'
    default:
      return '未知'
  }
}
