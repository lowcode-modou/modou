import { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'
import { cloneDeep, isObject } from 'lodash'

import { DEFAULT_TO_EMPTY } from '../../constants'
import { parseScheme } from './parseScheme'

export const parseObject = (
  schema: JsonSchema7ObjectType & { default?: Record<string, any> },
) => {
  let defaultObject: Record<string, any> | symbol = isObject(
    schema.default as any,
  )
    ? cloneDeep(schema.default!)
    : DEFAULT_TO_EMPTY
  Object.entries(schema.properties).forEach(([key, value]) => {
    const defaultItem = parseScheme(value)
    if (defaultItem === DEFAULT_TO_EMPTY) {
      return
    }
    if (defaultObject === DEFAULT_TO_EMPTY) {
      defaultObject = {}
    }
    ;(defaultObject as Record<string, any>)[key] = defaultItem
  })
  return defaultObject
}
