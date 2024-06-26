import { Select } from 'antd'
import { FC } from 'react'

import { SETTER_KEY, SetterTypeEnum } from '../constants'
import { BaseMRSetterOptions, BaseSetterProps, MRSetter } from '../types'

interface SelectSetterOption {
  label: string
  value: string
}

enum SelectSetterModeEnum {
  Multiple = 'multiple',
  Tags = 'tags',
}

interface SelectSetterOptions extends BaseMRSetterOptions {
  mode?: SelectSetterModeEnum
  options: SelectSetterOption[]
}

// export const mrSelectSetter: MRSetter<SelectSetterOptions> = (options) => {
//   // return mrInstance._extra({
//   //   [SETTER_KEY]: {
//   //     type: SetterTypeEnum.Select,
//   //     ...options
//   //   }
//   // })
//   return {
//     [SETTER_KEY]: {
//       type: SetterTypeEnum.Select,
//       ...options,
//     },
//   }
// }

export interface MRSelectSetterType extends SelectSetterOptions {
  type: SetterTypeEnum.Select
}

// interface PropsM<T extends string = string> extends BaseSetterProps<T[]> {
//   options: SelectSetterOptions
// }
//
// interface PropsS<T extends string = string> extends BaseSetterProps<T> {
//   options: Omit<SelectSetterOptions, 'mode'> & { mode?: undefined }
// }

// type Props<T extends string = string> = PropsM<T> | PropsS<T>

type PropsM = BaseSetterProps<string[], SelectSetterOptions>

type PropsS = BaseSetterProps<
  string,
  Omit<SelectSetterOptions, 'mode'> & { mode?: undefined }
>

type Props = PropsM | PropsS

export const SelectSetter: FC<Props> = ({ value, onChange, options }) => {
  return (
    <Select
      mode={options?.mode}
      value={value}
      onChange={(val) => onChange(val as any)}
    >
      {options?.options.map((option) => (
        <Select.Option key={option.value} value={option.value}>
          {option.label}
        </Select.Option>
      ))}
    </Select>
  )
}
