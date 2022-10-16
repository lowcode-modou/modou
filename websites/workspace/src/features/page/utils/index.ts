import { AppFactory, WidgetGroupEnum } from '@modou/core'
import {
  BooleanSetter,
  NumberSetter,
  SelectSetter,
  SetterTypeEnum,
  StringSetter,
} from '@modou/setters'
import {
  ButtonWidget,
  ColWidget,
  InputWidget,
  RowWidget,
  buttonWidgetMetadata,
  colWidgetMetadata,
  inputWidgetMetadata,
  rowWidgetMetadata,
} from '@modou/widgets'

export const widgetFactory = AppFactory.create({
  widgets: [
    {
      component: ButtonWidget,
      metadata: buttonWidgetMetadata,
      group: WidgetGroupEnum.Button,
    },
    {
      component: RowWidget,
      metadata: rowWidgetMetadata,
      group: WidgetGroupEnum.Container,
    },
    {
      component: ColWidget,
      metadata: colWidgetMetadata,
      group: WidgetGroupEnum.Container,
    },
    {
      component: InputWidget,
      metadata: inputWidgetMetadata,
      group: WidgetGroupEnum.Input,
    },
  ],
  setters: {
    [SetterTypeEnum.Select]: SelectSetter,
    [SetterTypeEnum.String]: StringSetter,
    [SetterTypeEnum.Boolean]: BooleanSetter,
    [SetterTypeEnum.Number]: NumberSetter,
  },
})
