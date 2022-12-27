// check difference for after body change and parsing
import { Variable } from '@modou/code-editor/CodeEditor/entities/JSCollection'

export interface ParsedJSSubAction {
  name: string
  body: string
  arguments: Variable[]
  isAsync: boolean
  // parsedFunction - used only to determine if function is async
  parsedFunction?: () => unknown
}

export interface ParsedBody {
  actions: ParsedJSSubAction[]
  variables: Variable[]
}

export interface JSUpdate {
  id: string
  parsedBody: ParsedBody | undefined
}
