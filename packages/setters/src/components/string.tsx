import { useDebounceFn, useMemoizedFn } from 'ahooks'
import { Input } from 'antd'
import { FC, useEffect, useState } from 'react'

import { SetterTypeEnum } from '../constants'
import { BaseMRSetterOptions, BaseSetterProps } from '../types'

export interface MRStringSetterType extends BaseMRSetterOptions {
  type: SetterTypeEnum.String
  textArea?: boolean
}

type Props = BaseSetterProps<string, MRStringSetterType>

export const StringSetter: FC<Props> = ({ value, onChange, options }) => {
  const Component = options?.textArea ? Input.TextArea : Input
  const [realValue, setRealValue] = useState(value)
  const { run } = useDebounceFn(onChange, { wait: 300 })
  const debounceSetValue = useMemoizedFn(
    (valOrUpdater: ((currVal: any) => any) | any): void => {
      setRealValue(valOrUpdater)
      run(valOrUpdater)
    },
  )
  useEffect(() => {
    setRealValue(value)
  }, [value])
  return (
    <Component
      value={realValue}
      onChange={(val) => debounceSetValue(val.target.value)}
    />
  )
}
