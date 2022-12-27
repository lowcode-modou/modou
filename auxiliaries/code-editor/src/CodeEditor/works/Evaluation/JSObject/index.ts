import { Variables } from 'eslint/rules/variables'

import { JsObjectProperty, NodeTypes, parseJSObjectWithAST } from '@modou/ast'
import { DataTree } from '@modou/code-editor/CodeEditor/common/editor-config'
import { DataTreeJSAction } from '@modou/code-editor/CodeEditor/entities/DataTree/dataTreeFactory'
import { JSUpdate } from '@modou/code-editor/CodeEditor/utils/JSPaneUtils'
import { isJSAction } from '@modou/code-editor/CodeEditor/works/Evaluation/evaluationUtils'
import DataTreeEvaluator from '@modou/code-editor/CodeEditor/works/common/DataTreeEvaluator'

type Actions = {
  name: string
  body: string
  arguments: Array<{ key: string; value: unknown }>
  parsedFunction: any
  isAsync: boolean
}
const regex = new RegExp(/^export default[\s]*?({[\s\S]*?})/)
function deleteResolvedFunctionsAndCurrentJSCollectionState(
  dataTreeEvalRef: DataTreeEvaluator,
  entityName: string,
) {
  Reflect.deleteProperty(dataTreeEvalRef.resolvedFunctions, entityName)
  Reflect.deleteProperty(dataTreeEvalRef.currentJSCollectionState, entityName)
}
function parseFunction(
  parsedElement: JsObjectProperty,
  unEvalDataTree: DataTree,
  dataTreeEvalRef: DataTreeEvaluator,
  entityName: string,
  actions: Actions[],
) {
  const { result } = evaluateSync(
    parsedElement.value,
    unEvalDataTree,
    {},
    true,
    undefined,
    undefined,
    true,
  )
  if (!!result) {
    let params: Array<{ key: string; value: unknown }> = []

    if (parsedElement.arguments) {
      params = parsedElement.arguments.map(({ defaultValue, paramName }) => ({
        key: paramName,
        value: defaultValue,
      }))
    }

    const functionString: string = parsedElement.value
    set(
      dataTreeEvalRef.resolvedFunctions,
      `${entityName}.${parsedElement.key}`,
      result,
    )
    set(
      dataTreeEvalRef.currentJSCollectionState,
      `${entityName}.${parsedElement.key}`,
      functionString,
    )
    actions.push({
      name: parsedElement.key,
      body: functionString,
      arguments: params,
      parsedFunction: result,
      isAsync: false,
    })
  }
}
function getParsedBody(
  parsedObject: Array<JsObjectProperty>,
  unEvalDataTree: DataTree,
  dataTreeEvalRef: DataTreeEvaluator,
  entityName: string,
) {
  const actions: Actions[] = []
  const variables: Variables[] = []
  for (const parsedElement of parsedObject) {
    switch (parsedElement.type) {
      case 'literal':
        continue
      case NodeTypes.ArrowFunctionExpression:
      case NodeTypes.FunctionExpression:
        parseFunction(
          parsedElement,
          unEvalDataTree,
          dataTreeEvalRef,
          entityName,
          actions,
        )
        break
      default:
        parseVariables(variables, parsedElement, dataTreeEvalRef, entityName)
    }
  }
  return {
    actions,
    variables,
  }
}
export function saveResolvedFunctionsAndJSUpdates(
  dataTreeEvalRef: DataTreeEvaluator,
  entity: DataTreeJSAction,
  unEvalDataTree: DataTree,
  entityName: string,
  jsUpdates: Record<string, JSUpdate>,
) {
  const correctFormat = regex.test(entity.body)
  if (correctFormat) {
    const body = entity.body.replace(/export default/g, '')
    try {
      deleteResolvedFunctionsAndCurrentJSCollectionState(
        dataTreeEvalRef,
        entityName,
      )
      const parseStartTime = performance.now()
      const parsedObject = parseJSObjectWithAST(body)
      const parseEndTime = performance.now()
      const JSObjectASTParseTime = parseEndTime - parseStartTime
      dataTreeEvalRef.logs.push({
        JSObjectName: entityName,
        JSObjectASTParseTime,
      })

      const parsedBody = parsedObject
        ? {
            body: entity.body,
            ...getParsedBody(
              parsedObject,
              unEvalDataTree,
              dataTreeEvalRef,
              entityName,
            ),
          }
        : undefined

      set(jsUpdates, `${entityName}`, {
        parsedBody,
        id: entity.actionId,
      })
    } catch (e) {
      // if we need to push error as popup in case
    }
  } else {
    const errors = {
      type: EvalErrorTypes.PARSE_JS_ERROR,
      context: {
        entity,
        propertyPath: entity.name + '.body',
      },
      message: 'Start object with export default',
    }
    dataTreeEvalRef.errors.push(errors)
  }
  return jsUpdates
}
export function parseJSActions(
  dataTreeEvalRef: DataTreeEvaluator,
  unEvalDataTree: DataTree,
) {
  let jsUpdates: Record<string, JSUpdate> = {}
  const unEvalDataTreeKeys = Object.keys(unEvalDataTree)
  for (const entityName of unEvalDataTreeKeys) {
    const entity = unEvalDataTree[entityName]
    if (!isJSAction(entity)) {
      continue
    }
    jsUpdates = saveResolvedFunctionsAndJSUpdates(
      dataTreeEvalRef,
      entity,
      unEvalDataTree,
      entityName,
      jsUpdates,
    )
  }
  return parseJSUpdates(jsUpdates, unEvalDataTree, dataTreeEvalRef)
}
