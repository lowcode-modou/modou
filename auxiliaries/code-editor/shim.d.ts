import { ActionDescription } from '@modou/code-editor/CodeEditor/entities/DataTree/actionTriggers'

declare global {
  /** All identifiers added to the worker global scope should also
   * be included in the DEDICATED_WORKER_GLOBAL_SCOPE_IDENTIFIERS in
   * app/client/src/constants/WidgetValidation.ts
   * */

  interface Window {
    ALLOW_ASYNC?: boolean
    IS_ASYNC?: boolean
    TRIGGER_COLLECTOR: ActionDescription[]
    evaluationVersion: number
  }
}
