import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
import { parseScheme } from './parsers/parseScheme'
import { omitBy } from 'lodash'
import { DEFAULT_TO_EMPTY } from '../constants'

export const schemeToJsonDefault = (scheme: JsonSchema7Type) => {
  const defaultJson = parseScheme(scheme) || {}
  console.log('defaultJson', defaultJson)
  return omitBy(defaultJson, val => val === DEFAULT_TO_EMPTY)
}
