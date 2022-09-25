import { MRType } from '@modou/refine'
import { SETTER_KEY, SetterTypeEnum } from '../constants'

type MRExtraType<T extends Object> =
  (extra: Parameters<MRType['_extra']>[0]
  & { 'x-setter': { type: SetterTypeEnum } & T }) => ReturnType<MRType['_extra']>

export type MRInstanceSetterType<T extends Object> = Omit<MRType, '_extra'> & { _extra: MRExtraType<T> }

export interface BaseSetterProps<T, O = any> {
  value: T
  onChange: (value: T) => void
  options?: O
}

export interface BaseMRSetterOptions {
  label: string
  description?: string
}

// export type MRSetter<T extends BaseMRSetterOptions> =
//   (mrInstance: MRInstanceSetterType<T>, options: T) => void

export type MRSetter<T extends BaseMRSetterOptions> =
  (options: T) => ({
    [SETTER_KEY]: {
      type: SetterTypeEnum
    } & T
  })
