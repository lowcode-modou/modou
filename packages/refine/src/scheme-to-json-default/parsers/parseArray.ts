import { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
// import { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'

export const parseArray = (schema: JsonSchema7Type) => {
  return schema.default
}
