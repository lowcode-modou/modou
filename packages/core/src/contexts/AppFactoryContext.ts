import { createContext, memo } from 'react'

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
  TableWidget,
  buttonWidgetMetadata,
  colWidgetMetadata,
  formWidgetMetadata,
  inputWidgetMetadata,
  rowWidgetMetadata,
  tableWidgetMetadata,
} from '@modou/widgets'

import { AppFactory } from '../app-factory'
import { WidgetGroupEnum } from '../types'

export const defaultAppFactory = AppFactory.create({
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
    {
      component: TableWidget,
      metadata: tableWidgetMetadata,
      group: WidgetGroupEnum.Container,
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

export const AppFactoryContext = createContext<AppFactory>(defaultAppFactory)
