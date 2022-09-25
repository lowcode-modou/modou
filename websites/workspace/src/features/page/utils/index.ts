import { WidgetFactory } from '@modou/core'
import {
  ButtonWidget,
  buttonWidgetMetadata,
  ColWidget,
  colWidgetMetadata,
  RowWidget,
  rowWidgetMetadata
} from '@modou/widgets'

import {
  StringSetter,
  NumberSetter,
  BooleanSetter,
  SelectSetter,
  SetterTypeEnum
} from '@modou/setters'

export const widgetFactory = WidgetFactory.create({
  widgets: [
    [ButtonWidget, buttonWidgetMetadata],
    [ColWidget, colWidgetMetadata],
    [RowWidget, rowWidgetMetadata]
  ],
  setters: {
    [SetterTypeEnum.Select]: SelectSetter,
    [SetterTypeEnum.String]: StringSetter,
    [SetterTypeEnum.Boolean]: BooleanSetter,
    [SetterTypeEnum.Number]: NumberSetter
  }
})
