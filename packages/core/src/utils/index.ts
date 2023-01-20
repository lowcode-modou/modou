import { customAlphabet } from 'nanoid'

import { WidgetGroupEnum } from '../types'

const nanoid = customAlphabet('abcdefghigklmnopqrstuvwxyz', 12)
export const generateId = (size: number = 12): string => {
  return nanoid(size)
}

export const getWidgetGroupLabel = (group: WidgetGroupEnum) => {
  switch (group) {
    case WidgetGroupEnum.Button:
      return '按钮类'
    case WidgetGroupEnum.Container:
      return '容器类'
    case WidgetGroupEnum.Input:
      return '输入类'
    default:
      return '其他'
  }
}
