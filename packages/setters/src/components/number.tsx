import { BaseSetterProps, MRInstanceSetterType } from '../types'
import { SETTER_KEY, SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { InputNumber } from 'antd'

export const mrNumberSetter = (mrInstance: MRInstanceSetterType<{}>) => {
  return mrInstance._extra({
    [SETTER_KEY]: {
      type: SetterTypeEnum.Number
    }
  })
}

type Props = BaseSetterProps<number>

export const NumberSetter: FC<Props> = ({ value, onChange }) => {
  return <InputNumber value={value} onChange={val => onChange(val)} />
}
