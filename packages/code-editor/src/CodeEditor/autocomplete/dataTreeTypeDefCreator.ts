import { isObject, uniqueId } from 'lodash'
import { Def } from 'tern'

import { Types, getType } from '../utils/TypeHelpers'

export type ExtraDef = Record<string, Def | string>

export const generateTypeDef = (
  value: unknown,
  extraDefsToDefine?: ExtraDef,
  depth = 0,
): Def | string => {
  switch (getType(value)) {
    case Types.ARRAY: {
      const array = value as [unknown]
      if (depth > 5) {
        return `[?]`
      }

      const arrayElementType = generateTypeDef(
        array[0],
        extraDefsToDefine,
        depth + 1,
      )

      if (isObject(arrayElementType)) {
        if (extraDefsToDefine) {
          const uniqueDefName = uniqueId('def_')
          extraDefsToDefine[uniqueDefName] = arrayElementType
          return `[${uniqueDefName}]`
        }
        return `[?]`
      }
      return `[${arrayElementType}]`
    }
    case Types.OBJECT: {
      const objType: Def = {}
      const object = value as Record<string, unknown>
      Object.keys(object).forEach((k) => {
        objType[k] = generateTypeDef(object[k], extraDefsToDefine, depth)
      })
      return objType
    }
    case Types.STRING:
      return 'string'
    case Types.NUMBER:
      return 'number'
    case Types.BOOLEAN:
      return 'bool'
    case Types.NULL:
    case Types.UNDEFINED:
      return '?'
    default:
      return '?'
  }
}
