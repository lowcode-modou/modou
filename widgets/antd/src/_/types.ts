// import { SelectSetter } from '@modou/setters'
// export type MRSelectOptions = Parameters<typeof SelectSetter>[0]['options']
import { FC, ReactNode } from 'react'

import { MRTypeAny, mr } from '@modou/refine'

export type MRSelectOptions = Array<{
  label: string
  value: string
}>

export type InferWidgetState<T extends MRTypeAny> = {
  [K in keyof mr.infer<T>]: K extends 'renderSlots'
    ? {
        [SK in keyof mr.infer<T>[K]]: ReactNode[]
      }
    : mr.infer<T>[K]
} & {
  updateState: (
    state:
      | Partial<mr.infer<T>>
      | ((state: mr.infer<T>) => Partial<mr.infer<T>>),
  ) => void
}

export type InterWidgetProps<T extends MRTypeAny> = mr.infer<T>
