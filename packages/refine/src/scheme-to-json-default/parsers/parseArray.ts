import { JsonSchema7ArrayType } from '@lowcode-modou/zod-to-json-schema/src/parsers/array'
import { cloneDeep, isObject } from 'lodash'
import { DEFAULT_TO_EMPTY } from '../../constants'

export const parseArray = (schema: JsonSchema7ArrayType & { default?: any[] }) => {
  const defaultArray: any[] | symbol = isObject(schema.default as any) ? cloneDeep(schema.default!) : DEFAULT_TO_EMPTY
  return defaultArray
}
