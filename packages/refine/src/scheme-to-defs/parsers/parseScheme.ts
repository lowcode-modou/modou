import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
import { JsonSchema7ArrayType } from '@lowcode-modou/zod-to-json-schema/src/parsers/array'
import { JsonSchema7BooleanType } from '@lowcode-modou/zod-to-json-schema/src/parsers/boolean'
import { JsonSchema7NumberType } from '@lowcode-modou/zod-to-json-schema/src/parsers/number'
import { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'
import { JsonSchema7StringType } from '@lowcode-modou/zod-to-json-schema/src/parsers/string'
import { omit } from 'lodash'

import { MDTernDefs, MixedMDTernDefs } from '../types'
import { parseAny } from './parseAny'
import { parseArray } from './parseArray'
import { parseBoolean } from './parseBoolean'
import { parseNumber } from './parseNumber'
import { parseObject } from './parseObject'
import { parseString } from './parseString'

export type JsonSchema7TypeType =
  | 'object'
  | 'array'
  | 'string'
  | 'number'
  | 'boolean'
  | unknown

export const selectParser = (
  scheme: JsonSchema7Type & { type: JsonSchema7TypeType },
): MixedMDTernDefs => {
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
      return parseAny(scheme)
    // throw new Error(`unknown json scheme type ${String(scheme.type)}`)
  }
}

export const parseScheme = (scheme: JsonSchema7Type): MDTernDefs => {
  const mixedDefs = selectParser(
    scheme as unknown as JsonSchema7Type & { type: JsonSchema7TypeType },
  )
  const defs: MDTernDefs = {
    ...mixedDefs.defs,
  }

  if (mixedDefs.scopedDefs) {
    defs['!define'] = mixedDefs.scopedDefs
  }

  return defs
}
