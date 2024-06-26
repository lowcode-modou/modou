import { InputNumber } from 'antd'
import { FC } from 'react'

import { SetterTypeEnum } from '../constants'
import { BaseMRSetterOptions, BaseSetterProps } from '../types'

// export const mrNumberSetter: MRSetter<BaseMRSetterOptions> = (options) => {
//   return {
//     [SETTER_KEY]: {
//       type: SetterTypeEnum.Number,
//       ...options,
//     },
//   }
// }
export interface MRNumberSetterType extends BaseMRSetterOptions {
  type: SetterTypeEnum.Number
}

type Props = BaseSetterProps<number>

export const NumberSetter: FC<Props> = ({ value, onChange }) => {
  return (
    <InputNumber value={value} onChange={(val) => onChange(val as number)} />
  )
}
