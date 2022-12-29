import { TriggerSource } from '@modou/code-editor/CodeEditor/constants/AppsmithActionConstants/ActionConstants'

export type TriggerMeta = {
  source?: TriggerSource
  triggerPropertyName?: string
}
