import { createContext } from 'react'

type DataTreeEntity = any
type DataTree = Record<string, DataTreeEntity>

type DatasourceDataState = Record<string, any>
export interface CodeEditorContextProps {
  dynamicData: DataTree
  datasources: DatasourceDataState
}
export const CodeEditorContext = createContext<CodeEditorContextProps>({
  dynamicData: {},
  datasources: {},
})
