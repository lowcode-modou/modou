// import { SelectSetter } from '@modou/setters'

// export type MRSelectOptions = Parameters<typeof SelectSetter>[0]['options']
import { mr, MRTypeAny } from '@modou/refine'
import { ReactNode } from 'react'

export type MRSelectOptions = Array<{
  label: string
  value: string
}>

export type InferWidgetState<T extends MRTypeAny> = {
  [K in keyof mr.infer<T>]: K extends 'renderSlots'
    ? {
        [SK in keyof mr.infer<T>[K]]: ReactNode
      }
    : mr.infer<T>[K]
}
