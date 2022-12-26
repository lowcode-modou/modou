import {
  DataTreeEntity,
  DataTreeJSAction,
} from '@modou/code-editor/CodeEditor/entities/DataTree/dataTreeFactory'
import { ENTITY_TYPE } from '@modou/code-editor/CodeEditor/entities/DataTree/types'

export const getEntityNameAndPropertyPath = (
  fullPath: string,
): {
  entityName: string
  propertyPath: string
} => {
  const indexOfFirstDot = fullPath.indexOf('.')
  if (indexOfFirstDot === -1) {
    // No dot was found so path is the entity name itself
    return {
      entityName: fullPath,
      propertyPath: '',
    }
  }
  const entityName = fullPath.substring(0, indexOfFirstDot)
  const propertyPath = fullPath.substring(indexOfFirstDot + 1)
  return { entityName, propertyPath }
}

// For the times when you need to know if something truly an object like { a: 1, b: 2}
// typeof, lodash.isObject and others will return false positives for things like array, null, etc
export const isTrueObject = (
  item: unknown,
): item is Record<string, unknown> => {
  return Object.prototype.toString.call(item) === '[object Object]'
}

export function isJSAction(entity: DataTreeEntity): entity is DataTreeJSAction {
  return (
    typeof entity === 'object' &&
    'ENTITY_TYPE' in entity &&
    entity.ENTITY_TYPE === ENTITY_TYPE.JSACTION
  )
}
