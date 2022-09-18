import { MRType } from '@modou/refine'
import { SetterTypeEnum } from '../constants'

type MRExtraType<T extends Object> = (extra: Parameters<MRType['_extra']>[0] & { 'x-setter': { type: SetterTypeEnum } & T }) => ReturnType<MRType['_extra']>

export type MRInstanceSetterType<T extends Object> = Omit<MRType, '_extra'> & { _extra: MRExtraType<T> }

export interface BaseSetterProps<T> {
  value: T
  onChange: (value: T) => void
}
