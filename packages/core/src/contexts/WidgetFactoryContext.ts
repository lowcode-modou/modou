import { createContext } from 'react'
import { AppFactory } from '../app-factory'

export const WidgetFactoryContext = createContext<AppFactory>(AppFactory.create({
  widgets: [],
  setters: {}
}))
