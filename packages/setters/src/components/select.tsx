import { SETTER_KEY } from '../constants'
import { MRInstanceSetterType, SetterTypeEnum } from '../types'
import { FC } from 'react'
import { Select } from 'antd'

interface SelectSetterOption {
  label: string
  value: string
}

enum SelectSetterModeEnum {
  Multiple = 'multiple',
  Tags = 'tags'
}

interface SelectSetterOptions {
  mode?: SelectSetterModeEnum
  options: SelectSetterOption[]
}

export const mrSelectSetter = (mrInstance: MRInstanceSetterType<SelectSetterOptions>, options: SelectSetterOptions): void => {
  mrInstance._extra({
    [SETTER_KEY]: {
      type: SetterTypeEnum.Select,
      ...options
    }
  })
}

type Props<T extends string = string> = {
  value: T[]
  onChange: (value: T[]) => void
  options: SelectSetterOptions
} | {
  value: T
  onChange: (value: T) => void
  options: Omit<SelectSetterOptions, 'mode'> & { mode?: undefined }
}

export const SelectSetter = <T extends string = string, > (props: Props<T>): ReturnType<FC> => {
  const { value, onChange, options: { options, mode } } = props
  return <Select mode={mode} value={value} onChange={val => onChange(val as any)}>
    {options.map(option => <Select.Option key={option.value} value={option.value}>{option.label}</Select.Option>)}
  </Select>
}
