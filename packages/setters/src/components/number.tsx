import { BaseMRSetterOptions, BaseSetterProps, MRSetter } from '../types'
import { SETTER_KEY, SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { InputNumber } from 'antd'

export const mrNumberSetter: MRSetter<BaseMRSetterOptions> = (options) => {
  return {
    [SETTER_KEY]: {
      type: SetterTypeEnum.Number,
      ...options
    }
  }
}

type Props = BaseSetterProps<number>

export const NumberSetter: FC<Props> = ({ value, onChange }) => {
  return <InputNumber value={value} onChange={val => onChange(val as number)} />
}
