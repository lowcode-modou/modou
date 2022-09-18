import { BaseSetterProps, MRInstanceSetterType } from '../types'
import { SETTER_KEY, SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { Switch } from 'antd'

export const mrBooleanSetter = (mrInstance: MRInstanceSetterType<{}>) => {
  return mrInstance._extra({
    [SETTER_KEY]: {
      type: SetterTypeEnum.Boolean
    }
  })
}

type Props = BaseSetterProps<boolean>

export const BooleanSetter: FC<Props> = ({ value, onChange }) => {
  return <Switch checked={value} onChange={onChange} />
}
