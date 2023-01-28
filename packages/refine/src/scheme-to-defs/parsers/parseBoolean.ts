import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'

import { SETTER_KEY } from '../constants'
import { MixedMDTernDefs } from '../types'

export const parseBoolean = (schema: JsonSchema7Type): MixedMDTernDefs => {
  return {
    defs: {
      '!type': 'bool',
      '!doc': Reflect.get(schema, SETTER_KEY)?.description ?? '',
    },
  }
}
