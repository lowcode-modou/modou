import { JsonSchema7ArrayType } from '@lowcode-modou/zod-to-json-schema/src/parsers/array'
import { isEmpty } from 'lodash'

import { SETTER_KEY } from '../constants'
import { MixedMDTernDefs } from '../types'
import { selectParser } from './parseScheme'

export const parseArray = (
  schema: JsonSchema7ArrayType & { default?: any[] },
): MixedMDTernDefs => {
  const itemKey = Math.random().toString().replace('.', '_')
  const items = schema.items as unknown as JsonSchema7ArrayType
  const scopedDefs = selectParser(items)
  return {
    defs: {
      '!type': `[${isEmpty(scopedDefs.defs) ? 'any' : itemKey}]`,
      '!doc': Reflect.get(schema, SETTER_KEY)?.description ?? '',
    },
    scopedDefs: {
      [itemKey]: scopedDefs.defs,
      ...scopedDefs.scopedDefs,
    },
  }
}
