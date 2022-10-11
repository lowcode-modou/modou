import { createContext, MutableRefObject } from 'react'
import { WidgetBaseProps } from '@modou/core'

export const DesignerContext = createContext<{
  onWidgetsChange: MutableRefObject<(value: WidgetBaseProps[]) => void>
}>({
  onWidgetsChange: {
    current() {},
  },
})
