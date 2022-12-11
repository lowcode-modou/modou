import { Input } from 'antd'
import { FC } from 'react'

import { SetterTypeEnum } from '../constants'
import { BaseMRSetterOptions, BaseSetterProps } from '../types'

export interface MRArraySetterType extends BaseMRSetterOptions {
  type: SetterTypeEnum.Array
}

type Props = BaseSetterProps<string, MRArraySetterType>

export const ArraySetter: FC<Props> = ({ value, onChange, options }) => {
  return <Input value={value} onChange={(val) => onChange(val.target.value)} />
}
