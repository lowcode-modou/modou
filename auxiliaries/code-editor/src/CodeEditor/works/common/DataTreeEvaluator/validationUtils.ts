import { get, isEmpty, isUndefined, set } from 'lodash'

import { DataTree } from '@modou/code-editor/CodeEditor/common/editor-config'
import { ValidationConfig } from '@modou/code-editor/CodeEditor/constants/PropertyControlConstants'
import { Severity } from '@modou/code-editor/CodeEditor/entities/AppsmithConsole'
import { DataTreeWidget } from '@modou/code-editor/CodeEditor/entities/DataTree/dataTreeFactory'
import { PrivateWidgets } from '@modou/code-editor/CodeEditor/entities/DataTree/types'
import {
  EVAL_ERROR_PATH,
  EvaluationError,
  PropertyEvaluationErrorType,
  getEvalErrorPath,
  getEvalValuePath,
  isPathDynamicTrigger,
} from '@modou/code-editor/CodeEditor/utils/DynamicBindingUtils'
import {
  getEntityNameAndPropertyPath,
  isWidget,
  resetValidationErrorsForEntityProperty,
} from '@modou/code-editor/CodeEditor/works/Evaluation/evaluationUtils'
import { validate } from '@modou/code-editor/CodeEditor/works/Evaluation/validations'
import { EvalProps } from '@modou/code-editor/CodeEditor/works/common/DataTreeEvaluator/index'

export enum DataTreeDiffEvent {
  NEW = 'NEW',
  DELETE = 'DELETE',
  EDIT = 'EDIT',
  NOOP = 'NOOP',
}
export interface DataTreeDiff {
  payload: {
    propertyPath: string
    value?: string
  }
  event: DataTreeDiffEvent
}
export const getAllPrivateWidgetsInDataTree = (
  dataTree: DataTree,
): PrivateWidgets => {
  let privateWidgets: PrivateWidgets = {}

  Object.keys(dataTree).forEach((entityName) => {
    const entity = dataTree[entityName]
    if (isWidget(entity) && !isEmpty(entity.privateWidgets)) {
      privateWidgets = { ...privateWidgets, ...entity.privateWidgets }
    }
  })

  return privateWidgets
}

export const addErrorToEntityProperty = ({
  dataTree,
  errors,
  evalProps,
  fullPropertyPath,
}: {
  errors: EvaluationError[]
  dataTree: DataTree
  fullPropertyPath: string
  evalProps: EvalProps
}) => {
  const { entityName, propertyPath } =
    getEntityNameAndPropertyPath(fullPropertyPath)
  const isPrivateEntityPath =
    getAllPrivateWidgetsInDataTree(dataTree)[entityName]
  const logBlackList = get(dataTree, `${entityName}.logBlackList`, {})
  if (propertyPath && !(propertyPath in logBlackList) && !isPrivateEntityPath) {
    const errorPath = `${entityName}.${EVAL_ERROR_PATH}['${propertyPath}']`
    const existingErrors = get(evalProps, errorPath, []) as EvaluationError[]
    set(evalProps, errorPath, existingErrors.concat(errors))
  }

  return dataTree
}
export function validateAndParseWidgetProperty({
  currentTree,
  evalPropertyValue,
  evalProps,
  fullPropertyPath,
  unEvalPropertyValue,
  widget,
}: {
  fullPropertyPath: string
  widget: DataTreeWidget
  currentTree: DataTree
  evalPropertyValue: unknown
  unEvalPropertyValue: string
  evalProps: EvalProps
}): unknown {
  const { propertyPath } = getEntityNameAndPropertyPath(fullPropertyPath)
  if (isPathDynamicTrigger(widget, propertyPath)) {
    // TODO find a way to validate triggers
    return unEvalPropertyValue
  }
  const validation = widget.validationPaths[propertyPath]

  const { isValid, messages, parsed, transformed } = validateWidgetProperty(
    validation,
    evalPropertyValue,
    widget,
    propertyPath,
  )

  let evaluatedValue
  if (isValid) {
    evaluatedValue = parsed
    // remove validation errors is already present
    resetValidationErrorsForEntityProperty({
      evalProps,
      fullPropertyPath,
    })
  } else {
    evaluatedValue = isUndefined(transformed) ? evalPropertyValue : transformed

    const evalErrors: EvaluationError[] =
      messages?.map((message) => {
        return {
          raw: unEvalPropertyValue,
          errorMessage: message || '',
          errorType: PropertyEvaluationErrorType.VALIDATION,
          severity: Severity.ERROR,
        }
      }) ?? []
    // Add validation errors
    addErrorToEntityProperty({
      errors: evalErrors,
      evalProps,
      fullPropertyPath,
      dataTree: currentTree,
    })
  }
  set(
    evalProps,
    getEvalValuePath(fullPropertyPath, {
      isPopulated: false,
      fullPath: true,
    }),
    evaluatedValue,
  )

  return parsed
}

export function validateWidgetProperty(
  config: ValidationConfig,
  value: unknown,
  props: Record<string, unknown>,
  propertyPath: string,
) {
  if (!config) {
    return {
      isValid: true,
      parsed: value,
    }
  }
  return validate(config, value, props, propertyPath)
}

export function validateActionProperty(
  config: ValidationConfig,
  value: unknown,
) {
  if (!config) {
    return {
      isValid: true,
      parsed: value,
    }
  }
  return validate(config, value, {}, '')
}

export function getValidatedTree(
  tree: DataTree,
  option: { evalProps: EvalProps },
) {
  const { evalProps } = option
  return Object.keys(tree).reduce((tree, entityKey: string) => {
    const parsedEntity = tree[entityKey]
    if (!isWidget(parsedEntity)) {
      return tree
    }

    Object.entries(parsedEntity.validationPaths).forEach(
      ([property, validation]) => {
        const value = get(parsedEntity, property)
        // Pass it through parse
        const { isValid, messages, parsed, transformed } =
          validateWidgetProperty(validation, value, parsedEntity, property)
        set(parsedEntity, property, parsed)
        const evaluatedValue = isValid
          ? parsed
          : isUndefined(transformed)
          ? value
          : transformed
        set(
          evalProps,
          getEvalValuePath(`${entityKey}.${property}`, {
            isPopulated: false,
            fullPath: true,
          }),
          evaluatedValue,
        )
        if (!isValid) {
          const evalErrors: EvaluationError[] =
            messages?.map((message) => ({
              errorType: PropertyEvaluationErrorType.VALIDATION,
              errorMessage: message,
              severity: Severity.ERROR,
              raw: value,
            })) ?? []
          addErrorToEntityProperty({
            errors: evalErrors,
            evalProps,
            fullPropertyPath: getEvalErrorPath(`${entityKey}.${property}`, {
              isPopulated: false,
              fullPath: true,
            }),
            dataTree: tree,
          })
        }
      },
    )
    return { ...tree, [entityKey]: parsedEntity }
  }, tree)
}
export const getAllPaths = (
  records: any,
  curKey = '',
  result: Record<string, true> = {},
): Record<string, true> => {
  // Add the key if it exists
  if (curKey) result[curKey] = true
  if (Array.isArray(records)) {
    for (let i = 0; i < records.length; i++) {
      const tempKey = curKey ? `${curKey}[${i}]` : `${i}`
      getAllPaths(records[i], tempKey, result)
    }
  } else if (typeof records === 'object' && records) {
    for (const key of Object.keys(records)) {
      const tempKey = curKey ? `${curKey}.${key}` : `${key}`
      getAllPaths(records[key], tempKey, result)
    }
  }
  return result
}
