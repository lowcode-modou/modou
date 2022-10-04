import { MRSelectOptions } from '../_'

export enum ButtonWidgetShapeEnum {
  Default = 'default',
  Circle = 'circle',
  Round = 'round',
}

export enum ButtonWidgetSizeEnum {
  Large = 'large',
  Middle = 'middle',
  Small = 'small',
}

export enum ButtonWidgetTypeEnum {
  Primary = 'primary',
  Dashed = 'dashed',
  Link = 'link',
  Text = 'text',
  Default = 'default',
}

export const shapeOptions: MRSelectOptions = [
  {
    label: '默认',
    value: ButtonWidgetShapeEnum.Default
  },
  {
    label: '圆角',
    value: ButtonWidgetShapeEnum.Round
  },
  {
    label: '圆形',
    value: ButtonWidgetShapeEnum.Circle
  }
]

export const sizeOptions: MRSelectOptions = [
  {
    label: '正常',
    value: ButtonWidgetSizeEnum.Middle
  },
  {
    label: '大',
    value: ButtonWidgetSizeEnum.Large
  },
  {
    label: '小',
    value: ButtonWidgetSizeEnum.Small
  }
]

export const typeOptions: MRSelectOptions = [
  {
    label: '默认按钮',
    value: ButtonWidgetTypeEnum.Default
  },
  {
    label: '主按钮',
    value: ButtonWidgetTypeEnum.Primary
  },
  {
    label: '文本按钮',
    value: ButtonWidgetTypeEnum.Text
  },
  {
    label: '连接按钮',
    value: ButtonWidgetTypeEnum.Link
  },
  {
    label: '虚线按钮',
    value: ButtonWidgetTypeEnum.Dashed
  }
]
