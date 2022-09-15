import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'

export const parseString = (schema: JsonSchema7Type) => {
  return schema.default
}
