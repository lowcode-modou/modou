import { memo } from 'react'

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
  FormWidget,
  InputWidget,
  RowWidget,
  buttonWidgetMetadata,
  colWidgetMetadata,
  formWidgetMetadata,
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
      component: FormWidget,
      metadata: formWidgetMetadata,
      group: WidgetGroupEnum.Container,
    },
    {
      component: InputWidget,
      metadata: inputWidgetMetadata,
      group: WidgetGroupEnum.Input,
    },
  ].map((widget) => ({
    ...widget,
    component: memo(widget.component),
  })),
  setters: {
    [SetterTypeEnum.Select]: SelectSetter,
    [SetterTypeEnum.String]: StringSetter,
    [SetterTypeEnum.Boolean]: BooleanSetter,
    [SetterTypeEnum.Number]: NumberSetter,
  },
})
