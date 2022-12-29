import { ViewTypes } from './utils'

export type FormConfigType = Omit<ControlData, 'configProperty'> & {
  configProperty?: string
  children?: FormConfigType[]
  options?: DropdownOption[]
  fetchOptionsConditionally?: boolean
}

export interface ControlData {
  id: string
  label: string
  alternateViewTypes?: ViewTypes[]
  tooltipText?: string | Record<string, string>
  configProperty: string
  controlType: ControlType
  propertyValue?: any
  isValid: boolean
  validationMessage?: string
  validationRegex?: string
  dataType?: InputType
  initialValue?:
    | string
    | boolean
    | number
    | Record<string, string>
    | Array<string>
  info?: string //helper text
  isRequired?: boolean
  conditionals?: ConditonalObject // Object that contains the conditionals config
  hidden?: HiddenType
  placeholderText?: string | Record<string, string>
  schema?: any
  errorText?: string
  showError?: boolean
  encrypted?: boolean
  subtitle?: string
  showLineNumbers?: boolean
  url?: string
  urlText?: string
  logicalTypes?: string[]
  comparisonTypes?: string[]
  nestedLevels?: number
  customStyles?: any
  propertyName?: string
  identifier?: string
  sectionName?: string
  disabled?: boolean
  staticDependencyPathList?: string[]
  validator?: (value: string) => { isValid: boolean; message: string }
}
