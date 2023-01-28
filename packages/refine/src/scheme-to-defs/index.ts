import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'

import { parseScheme } from './parsers/parseScheme'
import { MDTernDefs } from './types'

export type { MDTernDefs } from './types'

export const schemeToDefs = (scheme: JsonSchema7Type): MDTernDefs => {
  return parseScheme(scheme) || {}
}
