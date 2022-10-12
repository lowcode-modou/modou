import { BaseMRSetterOptions, BaseSetterProps } from '../types'
import { SetterTypeEnum } from '../constants'
import { FC } from 'react'
import { Input } from 'antd'

// export const mrStringSetter: MRSetter<BaseMRSetterOptions> = (options) => {
//   // return mrInstance._extra({
//   //   [SETTER_KEY]: {
//   //     type: SetterTypeEnum.String,
//   //     ...options
//   //   }
//   // })
//   return {
//     [SETTER_KEY]: {
//       type: SetterTypeEnum.String,
//       ...options,
//     },
//   }
// }

export interface MRStringSetterType extends BaseMRSetterOptions {
  type: SetterTypeEnum.String
}

type Props = BaseSetterProps<string>

export const StringSetter: FC<Props> = ({ value, onChange }) => {
  return <Input value={value} onChange={(val) => onChange(val.target.value)} />
}
