import { JsonSchema7StringType } from '@lowcode-modou/zod-to-json-schema/src/parsers/string'

export const parseString = (
  schema: JsonSchema7StringType & { default?: string; const?: string },
) => {
  return schema.default ?? schema.const
}
