import { name, version } from '../package.json'
import type { ZodType, ZodSchema } from '@lowcode-modou/zod'

export { z as mr } from '@lowcode-modou/zod'

export type MRType = ZodType
export type MRScheme = ZodSchema

export { default as mrToJsonSchema } from '@lowcode-modou/zod-to-json-schema'

export * from './scheme-to-json-default'

export type { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
export type { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'

export const pkg = {
  name,
  version
}
