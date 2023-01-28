import { JsonSchema7StringType } from '@lowcode-modou/zod-to-json-schema/src/parsers/string'

import { SETTER_KEY } from '../constants'
import { MixedMDTernDefs } from '../types'

export const parseString = (schema: JsonSchema7StringType): MixedMDTernDefs => {
  return {
    defs: {
      '!type': 'string',
      '!doc': Reflect.get(schema, SETTER_KEY)?.description ?? '',
    },
  }
}
