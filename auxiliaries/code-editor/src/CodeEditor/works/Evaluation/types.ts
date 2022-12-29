import { DataTree } from '@modou/code-editor/CodeEditor/common/editor-config'
import { ActionValidationConfigMap } from '@modou/code-editor/CodeEditor/constants/PropertyControlConstants'
import { AppTheme } from '@modou/code-editor/CodeEditor/entities/AppTheming'
import { UserLogObject } from '@modou/code-editor/CodeEditor/entities/AppsmithConsole'
import { UnEvalTree } from '@modou/code-editor/CodeEditor/entities/DataTree/dataTreeFactory'
import { CanvasWidgetsReduxState } from '@modou/code-editor/CodeEditor/reducers/entityReducers/canvasWidgetsReducer'
import { JSUpdate } from '@modou/code-editor/CodeEditor/utils/JSPaneUtils'
import { WidgetTypeConfigMap } from '@modou/code-editor/CodeEditor/utils/WidgetFactory'
import { EvalMetaUpdates } from '@modou/code-editor/CodeEditor/works/common/DataTreeEvaluator/types'
import { DataTreeDiff } from '@modou/code-editor/CodeEditor/works/common/DataTreeEvaluator/validationUtils'
import { WorkerRequest } from '@modou/code-editor/CodeEditor/works/common/types'

import {
  DependencyMap,
  EVAL_WORKER_ACTIONS,
  EvalError,
} from '../../utils/DynamicBindingUtils'

export type EvalWorkerRequest = WorkerRequest<any, EVAL_WORKER_ACTIONS>
export type EvalWorkerResponse = EvalTreeResponseData | boolean | unknown

export interface EvalTreeRequestData {
  unevalTree: UnEvalTree
  widgetTypeConfigMap: WidgetTypeConfigMap
  widgets: CanvasWidgetsReduxState
  theme: AppTheme
  shouldReplay: boolean
  allActionValidationConfig: {
    [actionId: string]: ActionValidationConfigMap
  }
  requiresLinting: boolean
}

export interface EvalTreeResponseData {
  dataTree: DataTree
  dependencies: DependencyMap
  errors: EvalError[]
  evalMetaUpdates: EvalMetaUpdates
  evaluationOrder: string[]
  jsUpdates: Record<string, JSUpdate>
  logs: unknown[]
  userLogs: UserLogObject[]
  unEvalUpdates: DataTreeDiff[]
  isCreateFirstTree: boolean
}
