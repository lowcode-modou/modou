import { BaseMRSetterOptions, BaseSetterProps } from '../types'
import { SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { Switch } from 'antd'

// export const mrBooleanSetter: MRSetter<BaseMRSetterOptions> = (options) => {
//   // return mrInstance._extra({
//   //   [SETTER_KEY]: {
//   //     type: SetterTypeEnum.Boolean,
//   //     ...options
//   //   }
//   // })
//   return {
//     [SETTER_KEY]: {
//       type: SetterTypeEnum.Boolean,
//       ...options,
//     },
//   }
// }

export interface MRBooleanSetterType extends BaseMRSetterOptions {
  type: SetterTypeEnum.Boolean
}

type Props = BaseSetterProps<boolean>

export const BooleanSetter: FC<Props> = ({ value, onChange }) => {
  return <Switch checked={value} onChange={onChange} />
}
