import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
import { omitBy } from 'lodash'

import { DEFAULT_TO_EMPTY } from '../constants'
import { parseScheme } from './parsers/parseScheme'

export const schemeToJsonDefault = (scheme: JsonSchema7Type) => {
  const defaultJson = parseScheme(scheme) || {}
  return omitBy(defaultJson, (val) => val === DEFAULT_TO_EMPTY)
}
