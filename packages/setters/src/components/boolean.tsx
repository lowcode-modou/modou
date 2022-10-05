import { BaseMRSetterOptions, BaseSetterProps, MRSetter } from '../types'
import { SETTER_KEY, SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { Switch } from 'antd'

export const mrBooleanSetter: MRSetter<BaseMRSetterOptions> = (options) => {
  // return mrInstance._extra({
  //   [SETTER_KEY]: {
  //     type: SetterTypeEnum.Boolean,
  //     ...options
  //   }
  // })
  return {
    [SETTER_KEY]: {
      type: SetterTypeEnum.Boolean,
      ...options
    }
  }
}

type Props = BaseSetterProps<boolean>

export const BooleanSetter: FC<Props> = ({ value, onChange }) => {
  return <Switch checked={value} onChange={onChange} />
}
