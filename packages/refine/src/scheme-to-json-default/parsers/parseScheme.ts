import { parseObject } from './parseObject'
import { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'
import { parseArray } from './parseArray'
import { JsonSchema7ArrayType } from '@lowcode-modou/zod-to-json-schema/src/parsers/array'
import { JsonSchema7StringType } from '@lowcode-modou/zod-to-json-schema/src/parsers/string'
import { JsonSchema7BooleanType } from '@lowcode-modou/zod-to-json-schema/src/parsers/boolean'
import { JsonSchema7NumberType } from '@lowcode-modou/zod-to-json-schema/src/parsers/number'
import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
import { parseString } from './parseString'
import { parseNumber } from './parseNumber'
import { parseBoolean } from './parseBoolean'

type JsonSchema7TypeType =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | unknown

const selectParser = (
  scheme: JsonSchema7Type & { type: JsonSchema7TypeType },
) => {
  switch (scheme.type) {
    case 'object':
      return parseObject(scheme as JsonSchema7ObjectType)
    case 'array':
      return parseArray(scheme as JsonSchema7ArrayType)
    case 'string':
      return parseString(scheme as JsonSchema7StringType)
    case 'number':
      return parseNumber(scheme as JsonSchema7NumberType)
    case 'boolean':
      return parseBoolean(scheme as JsonSchema7BooleanType)
    default:
      throw new Error(`unknown json scheme type ${String(scheme.type)}`)
  }
}

export const parseScheme = (scheme: JsonSchema7Type) => {
  return selectParser(
    scheme as unknown as JsonSchema7Type & { type: JsonSchema7TypeType },
  )
}
