import { createContext } from 'react'
import { WidgetFactory } from '../widget-factory'

export const WidgetFactoryContext = createContext<WidgetFactory>(WidgetFactory.create({
  widgets: [],
  setters: {}
}))
