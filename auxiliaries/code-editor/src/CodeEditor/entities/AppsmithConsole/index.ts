import { ENTITY_TYPE } from '@modou/code-editor/CodeEditor/entities/DataTree/types'

export type Methods =
  | 'log'
  | 'debug'
  | 'info'
  | 'warn'
  | 'error'
  | 'table'
  | 'clear'
  | 'time'
  | 'timeEnd'
  | 'count'
  | 'assert'
export interface LogObject {
  method: Methods | 'result'
  data: any[]
  timestamp: string
  id: string
  severity: Severity
}

export interface SourceEntity {
  type: ENTITY_TYPE
  // Widget or action name
  name: string
  // Id of the widget or action
  id: string
  // property path of the child
  propertyPath?: string
}
export interface UserLogObject {
  logObject: LogObject[]
  source: SourceEntity
}

export enum Severity {
  // Everything, irrespective of what the user should see or not
  // DEBUG = "debug",
  // Something the dev user should probably know about
  INFO = 'info',
  // Doesn't break the app, but can cause slowdowns / ux issues/ unexpected behaviour
  WARNING = 'warning',
  // Can cause an error in some cases/ single widget, app will work in other cases
  ERROR = 'error',
  // Makes the app unusable, can't progress without fixing this.
  // CRITICAL = "critical",
}
