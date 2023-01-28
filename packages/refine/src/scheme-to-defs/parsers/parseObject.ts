import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
import { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'
import { omit } from 'lodash'

import { OMIT_DEF_KEYS, SETTER_KEY } from '../constants'
import { MDTernDefs, MixedMDTernDefs } from '../types'
import { JsonSchema7TypeType, selectParser } from './parseScheme'

export const parseObject = (
  schema: JsonSchema7ObjectType & { default?: Record<string, any> },
): MixedMDTernDefs => {
  const defs: MDTernDefs = {}

  const doc = Reflect.get(schema, SETTER_KEY)?.description
  if (doc) {
    defs['!doc'] = doc
  }

  let scopedDefs: Record<string, MDTernDefs> = {}
  Object.entries(omit(schema.properties, OMIT_DEF_KEYS) || {}).forEach(
    ([key, value]) => {
      const mixedDefs = selectParser(
        value as JsonSchema7Type & { type: JsonSchema7TypeType },
      )
      Reflect.set(defs, key, mixedDefs.defs)
      scopedDefs = { ...mixedDefs.scopedDefs }
    },
  )

  return {
    defs,
    scopedDefs,
  }
}
