import { createContext } from 'react'

import { AppFactory } from '../app-factory'

export const AppFactoryContext = createContext<AppFactory>(
  AppFactory.create({
    widgets: [],
    setters: {},
  }),
)
