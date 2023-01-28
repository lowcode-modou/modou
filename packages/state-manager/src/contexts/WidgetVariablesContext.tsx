import { FC, ReactNode, createContext, useContext } from 'react'

export interface WidgetVariables {
  i?: number
}

export const DEFAULT_WIDGET_VARIABLES: WidgetVariables = {}

const WidgetVariablesContext = createContext<WidgetVariables>({
  ...DEFAULT_WIDGET_VARIABLES,
})
export const WidgetVariablesProvider: FC<{
  value: WidgetVariables
  children: ReactNode
}> = ({ value, children }) => {
  return (
    <WidgetVariablesContext.Provider value={value}>
      {children}
    </WidgetVariablesContext.Provider>
  )
}

export const useWidgetVariables = () => {
  const widgetVariables = useContext(WidgetVariablesContext)
  return { widgetVariables }
}
