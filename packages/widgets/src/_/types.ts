// import { SelectSetter } from '@modou/setters'
// export type MRSelectOptions = Parameters<typeof SelectSetter>[0]['options']
import { ReactNode } from 'react'

import { MRTypeAny, mr } from '@modou/refine'

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
