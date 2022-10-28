import { Input } from 'antd'
import { FC } from 'react'

import { SetterTypeEnum } from '../constants'
import { BaseMRSetterOptions, BaseSetterProps } from '../types'

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
  textArea?: boolean
}

type Props = BaseSetterProps<string, MRStringSetterType>

export const StringSetter: FC<Props> = ({ value, onChange, options }) => {
  const Component = options?.textArea ? Input.TextArea : Input
  return (
    <Component value={value} onChange={(val) => onChange(val.target.value)} />
  )
}
