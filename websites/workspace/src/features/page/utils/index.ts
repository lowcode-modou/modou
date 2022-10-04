import { AppFactory, WidgetGroupEnum } from '@modou/core'
import {
  ButtonWidget,
  buttonWidgetMetadata, ColWidget, colWidgetMetadata,
  InputWidget,
  inputWidgetMetadata,
  RowWidget,
  rowWidgetMetadata
} from '@modou/widgets'

import { BooleanSetter, NumberSetter, SelectSetter, SetterTypeEnum, StringSetter } from '@modou/setters'

export const widgetFactory = AppFactory.create({
  widgets: [
    {
      component: ButtonWidget,
      metadata: buttonWidgetMetadata,
      group: WidgetGroupEnum.Button
    },
    {
      component: ColWidget,
      metadata: colWidgetMetadata,
      group: WidgetGroupEnum.Container
    },
    {
      component: RowWidget,
      metadata: rowWidgetMetadata,
      group: WidgetGroupEnum.Container
    },
    {
      component: InputWidget,
      metadata: inputWidgetMetadata,
      group: WidgetGroupEnum.Input
    }
  ],
  setters: {
    [SetterTypeEnum.Select]: SelectSetter,
    [SetterTypeEnum.String]: StringSetter,
    [SetterTypeEnum.Boolean]: BooleanSetter,
    [SetterTypeEnum.Number]: NumberSetter
  }
})
