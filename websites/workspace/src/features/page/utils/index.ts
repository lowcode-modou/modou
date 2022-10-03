import { AppFactory } from '@modou/core'
import {
  ButtonWidget,
  buttonWidgetMetadata,
  ColWidget,
  colWidgetMetadata,
  RowWidget,
  rowWidgetMetadata,
  InputWidget,
  inputWidgetMetadata
} from '@modou/widgets'

import {
  StringSetter,
  NumberSetter,
  BooleanSetter,
  SelectSetter,
  SetterTypeEnum
} from '@modou/setters'

export const widgetFactory = AppFactory.create({
  widgets: [
    [ButtonWidget, buttonWidgetMetadata],
    [ColWidget, colWidgetMetadata],
    [RowWidget, rowWidgetMetadata],
    [InputWidget, inputWidgetMetadata]
  ],
  setters: {
    [SetterTypeEnum.Select]: SelectSetter,
    [SetterTypeEnum.String]: StringSetter,
    [SetterTypeEnum.Boolean]: BooleanSetter,
    [SetterTypeEnum.Number]: NumberSetter
  }
})
