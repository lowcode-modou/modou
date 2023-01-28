import { createContext, memo } from 'react'

import { AssetVFS } from '@modou/asset-vfs'
import {
  ArraySetter,
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
} from '@modou/widgets-antd'

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
    [SetterTypeEnum.Array]: ArraySetter,
  },
})
const assetVFS = new AssetVFS({ appFactory: defaultAppFactory })
export const AppFactoryContext = createContext<AppFactory>(assetVFS.appFactory)
