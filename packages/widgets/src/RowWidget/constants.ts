import { MRSelectOptions } from '../_'

export enum RowWidgetAlignEnum {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
}

export enum RowWidgetJustifyEnum {
  Start = 'start',
  End = 'end',
  Center = 'center',
  SpaceAround = 'space-around',
  SpaceBetween = 'space-between',
  SpaceEvenly = 'space-evenly',
}

export const RowWidgetAlignOptions: MRSelectOptions = [
  {
    label: '居上',
    value: RowWidgetAlignEnum.Top,
  },
  {
    label: '居中',
    value: RowWidgetAlignEnum.Middle,
  },
  {
    label: '居下',
    value: RowWidgetAlignEnum.Bottom,
  },
]

export const RowWidgetJustifyOptions: MRSelectOptions = [
  {
    label: RowWidgetJustifyEnum.Start,
    value: RowWidgetJustifyEnum.Start,
  },
  {
    label: RowWidgetJustifyEnum.End,
    value: RowWidgetJustifyEnum.End,
  },
  {
    label: RowWidgetJustifyEnum.Center,
    value: RowWidgetJustifyEnum.Center,
  },
  {
    label: RowWidgetJustifyEnum.SpaceAround,
    value: RowWidgetJustifyEnum.SpaceAround,
  },
  {
    label: RowWidgetJustifyEnum.SpaceBetween,
    value: RowWidgetJustifyEnum.SpaceBetween,
  },
  {
    label: RowWidgetJustifyEnum.SpaceEvenly,
    value: RowWidgetJustifyEnum.SpaceEvenly,
  },
]
