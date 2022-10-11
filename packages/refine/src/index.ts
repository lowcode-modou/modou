import { name, version } from '../package.json'
import type {
  ZodType,
  ZodSchema,
  ZodTypeAny,
  ZodRawShape,
  ZodArray,
  ZodString,
  ZodDefault,
} from '@lowcode-modou/zod'
import { ZodObject } from '@lowcode-modou/zod'

export { z as mr } from '@lowcode-modou/zod'

export type MRType = ZodType
export type MRScheme = ZodSchema
export type MRTypeAny = ZodTypeAny
export type MRRawShape = ZodRawShape
export type MRString = ZodString
export type MRObject<T extends MRRawShape> = ZodObject<T>
export type MRArray<T extends MRTypeAny> = ZodArray<T>
export type MRDefault<T extends MRTypeAny> = ZodDefault<T>

export { default as mrToJsonSchema } from '@lowcode-modou/zod-to-json-schema'

export * from './scheme-to-json-default'

export type { JsonSchema7Type } from '@lowcode-modou/zod-to-json-schema/src/parseDef'
export type { JsonSchema7ObjectType } from '@lowcode-modou/zod-to-json-schema/src/parsers/object'

export const pkg = {
  name,
  version,
}
