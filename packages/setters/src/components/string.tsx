import { BaseSetterProps, MRInstanceSetterType } from '../types'
import { SETTER_KEY, SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { Input } from 'antd'

export const mrStringSetter = (mrInstance: MRInstanceSetterType<{}>) => {
  return mrInstance._extra({
    [SETTER_KEY]: {
      type: SetterTypeEnum.String
    }
  })
}

type Props = BaseSetterProps<string>

export const StringSetter: FC<Props> = ({ value, onChange }) => {
  return <Input value={value} onChange={val => onChange(val.target.value)} />
}
