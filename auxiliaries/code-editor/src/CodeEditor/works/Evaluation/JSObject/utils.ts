import { get, set, unset } from 'lodash'

import { DataTree } from '@modou/code-editor/CodeEditor/common/editor-config'
import { APP_MODE } from '@modou/code-editor/CodeEditor/entities/App'
import {
  DataTreeAppsmith,
  DataTreeJSAction,
} from '@modou/code-editor/CodeEditor/entities/DataTree/dataTreeFactory'
import { EvaluationSubstitutionType } from '@modou/code-editor/CodeEditor/entities/DataTree/types'
import {
  ParsedBody,
  ParsedJSSubAction,
} from '@modou/code-editor/CodeEditor/utils/JSPaneUtils'
import { isJSAction } from '@modou/code-editor/CodeEditor/works/Evaluation/evaluationUtils'

/**
 * here we add/remove the properties (variables and actions) which got added/removed from the JSObject parsedBody.
  NOTE: For other entity below logic is maintained in DataTreeFactory, for JSObject we handle it inside evaluations
 *
 * @param parsedBody
 * @param jsCollection
 * @param unEvalTree
 * @returns
 */
export const updateJSCollectionInUnEvalTree = (
  parsedBody: ParsedBody,
  jsCollection: DataTreeJSAction,
  unEvalTree: DataTree,
) => {
  // jsCollection here means unEvalTree JSObject
  const modifiedUnEvalTree = unEvalTree
  const functionsList: string[] = []
  const varList: string[] = jsCollection.variables
  Object.keys(jsCollection.meta).forEach((action) => {
    functionsList.push(action)
  })

  const oldConfig = Object.getPrototypeOf(jsCollection) as DataTreeJSAction

  if (parsedBody.actions && parsedBody.actions.length > 0) {
    for (let i = 0; i < parsedBody.actions.length; i++) {
      const action = parsedBody.actions[i]
      if (Reflect.has(jsCollection, action.name)) {
        if (jsCollection[action.name] !== action.body) {
          const data = get(
            modifiedUnEvalTree,
            `${jsCollection.name}.${action.name}.data`,
            {},
          )
          set(
            modifiedUnEvalTree,
            `${jsCollection.name}.${action.name}`,
            String(action.body),
          )

          set(
            modifiedUnEvalTree,
            `${jsCollection.name}.${action.name}.data`,
            data,
          )
        }
      } else {
        const reactivePaths = oldConfig.reactivePaths

        reactivePaths[action.name] = EvaluationSubstitutionType.SMART_SUBSTITUTE
        reactivePaths[`${action.name}.data`] =
          EvaluationSubstitutionType.TEMPLATE

        const dynamicBindingPathList = oldConfig.dynamicBindingPathList
        dynamicBindingPathList.push({ key: action.name })

        const dependencyMap = oldConfig.dependencyMap
        dependencyMap.body.push(action.name)

        const meta = oldConfig.meta
        meta[action.name] = {
          arguments: action.arguments,
          isAsync: false,
          confirmBeforeExecute: false,
          body: action.body,
        }

        const data = get(
          modifiedUnEvalTree,
          `${jsCollection.name}.${action.name}.data`,
          {},
        )
        set(
          modifiedUnEvalTree,
          `${jsCollection.name}.${action.name}`,
          String(action.body),
        )
        set(
          modifiedUnEvalTree,
          `${jsCollection.name}.${action.name}.data`,
          data,
        )
      }
    }
  }
  if (functionsList && functionsList.length > 0) {
    for (let i = 0; i < functionsList.length; i++) {
      const oldActionName = functionsList[i]
      const existed = parsedBody.actions.find(
        (js: ParsedJSSubAction) => js.name === oldActionName,
      )
      if (!existed) {
        const reactivePaths = oldConfig.reactivePaths
        Reflect.deleteProperty(reactivePaths, oldActionName)

        oldConfig.dynamicBindingPathList =
          oldConfig.dynamicBindingPathList.filter(
            (path) => path.key !== oldActionName,
          )

        const dependencyMap = oldConfig.dependencyMap.body
        const removeIndex = dependencyMap.indexOf(oldActionName)
        if (removeIndex > -1) {
          oldConfig.dependencyMap.body = dependencyMap.filter(
            (item) => item !== oldActionName,
          )
        }
        const meta = oldConfig.meta
        Reflect.deleteProperty(meta, oldActionName)

        unset(modifiedUnEvalTree[jsCollection.name], oldActionName)
        unset(modifiedUnEvalTree[jsCollection.name], `${oldActionName}.data`)
      }
    }
  }
  if (parsedBody.variables.length) {
    for (let i = 0; i < parsedBody.variables.length; i++) {
      const newVar = parsedBody.variables[i]
      const existedVar = varList.indexOf(newVar.name)
      if (existedVar > -1) {
        const existedVarVal = jsCollection[newVar.name]
        if (
          (!!existedVarVal && existedVarVal.toString()) !==
            newVar.value?.toString() ||
          (!existedVarVal && !!newVar)
        ) {
          set(
            modifiedUnEvalTree,
            `${jsCollection.name}.${newVar.name}`,
            newVar.value,
          )
        }
      } else {
        varList.push(newVar.name)
        const reactivePaths = oldConfig.reactivePaths
        reactivePaths[newVar.name] = EvaluationSubstitutionType.SMART_SUBSTITUTE

        const dynamicBindingPathList = oldConfig.dynamicBindingPathList
        dynamicBindingPathList.push({ key: newVar.name })

        set(modifiedUnEvalTree, `${jsCollection.name}.variables`, varList)
        set(
          modifiedUnEvalTree,
          `${jsCollection.name}.${newVar.name}`,
          newVar.value,
        )
      }
    }
    let newVarList: string[] = varList
    for (let i = 0; i < varList.length; i++) {
      const varListItem = varList[i]
      const existsInParsed = parsedBody.variables.find(
        (item) => item.name === varListItem,
      )
      if (!existsInParsed) {
        const reactivePaths = oldConfig.reactivePaths
        Reflect.deleteProperty(reactivePaths, varListItem)

        oldConfig.dynamicBindingPathList =
          oldConfig.dynamicBindingPathList.filter(
            (path) => path.key !== varListItem,
          )

        newVarList = newVarList.filter((item) => item !== varListItem)
        unset(modifiedUnEvalTree[jsCollection.name], varListItem)
      }
    }
    if (newVarList.length) {
      set(modifiedUnEvalTree, `${jsCollection.name}.variables`, newVarList)
    }
  }
  return modifiedUnEvalTree
}

/**
 * When JSObject parseBody is empty we remove all variables and actions from unEvalTree
 * this will lead to removal of properties from the dataTree
 * @param unEvalTree
 * @param entity
 * @returns
 */
export const removeFunctionsAndVariableJSCollection = (
  unEvalTree: DataTree,
  entity: DataTreeJSAction,
) => {
  const oldConfig = Object.getPrototypeOf(entity) as DataTreeJSAction
  const modifiedDataTree: DataTree = unEvalTree
  const functionsList: string[] = []
  Object.keys(entity.meta).forEach((action) => {
    functionsList.push(action)
  })
  // removed variables
  const varList: string[] = entity.variables
  set(modifiedDataTree, `${entity.name}.variables`, [])
  for (let i = 0; i < varList.length; i++) {
    const varName = varList[i]
    unset(modifiedDataTree[entity.name], varName)
  }
  // remove functions

  const reactivePaths = entity.reactivePaths
  const meta = entity.meta

  for (let i = 0; i < functionsList.length; i++) {
    const actionName = functionsList[i]
    Reflect.deleteProperty(reactivePaths, actionName)
    Reflect.deleteProperty(meta, actionName)
    unset(modifiedDataTree[entity.name], actionName)

    oldConfig.dynamicBindingPathList = oldConfig.dynamicBindingPathList.filter(
      (path: any) => path.key !== actionName,
    )

    entity.dependencyMap.body = entity.dependencyMap.body.filter(
      (item: any) => item !== actionName,
    )
  }

  return modifiedDataTree
}

export function isJSObjectFunction(
  dataTree: DataTree,
  jsObjectName: string,
  key: string,
) {
  const entity = dataTree[jsObjectName]
  if (isJSAction(entity)) {
    return Reflect.has(entity.meta, key)
  }
  return false
}

export function getAppMode(dataTree: DataTree) {
  const appsmithObj = dataTree.appsmith as DataTreeAppsmith
  return appsmithObj.mode as APP_MODE
}
