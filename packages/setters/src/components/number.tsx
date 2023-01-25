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
  min?: number
  max?: number
}

type Props = BaseSetterProps<number, MRNumberSetterType>

export const NumberSetter: FC<Props> = ({ value, onChange, options }) => {
  return (
    <InputNumber
      value={value}
      onChange={(val) => onChange(val as number)}
      style={{ width: '100%' }}
      min={options?.min ?? -Infinity}
      max={options?.max ?? Infinity}
    />
  )
}
