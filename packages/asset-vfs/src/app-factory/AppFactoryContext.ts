import { createContext, memo, useContext } from 'react'

import { WidgetGroupEnum } from '@modou/core'
import {
  BranchNode,
  LoopNode,
  RunScriptNode,
  StartNode,
  branchNodeInterpreter,
  branchNodeNodeMetadata,
  loopNodeInterpreter,
  loopNodeMetadata,
  runScriptNodeInterpreter,
  runScriptNodeMetadata,
  startNodeInterpreter,
  startNodeMetadata,
} from '@modou/flow-nodes'
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

import { AssetVFS } from '../AssetVFS'
import { AppFactory } from './index'

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
  flowNodes: [
    {
      component: StartNode,
      metadata: startNodeMetadata,
      interpreter: startNodeInterpreter,
    },
    {
      component: BranchNode,
      metadata: branchNodeNodeMetadata,
      interpreter: branchNodeInterpreter,
    },
    {
      component: LoopNode,
      metadata: loopNodeMetadata,
      interpreter: loopNodeInterpreter,
    },
    {
      component: RunScriptNode,
      metadata: runScriptNodeMetadata,
      interpreter: runScriptNodeInterpreter,
    },
  ],
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

export const useAppFactory = () => {
  const appFactory = useContext(AppFactoryContext)
  return { appFactory }
}
