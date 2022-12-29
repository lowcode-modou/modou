import _ from 'lodash'
import { Component } from 'react'

export interface ControlProps extends ControlData, ControlFunctions {
  key?: string
  additionalAutoComplete?: Record<string, Record<string, unknown>>
}
export interface ControlData
  extends Omit<PropertyPaneControlConfig, 'additionalAutoComplete' | 'label'> {
  propertyValue?: any
  defaultValue?: any
  errorMessage?: string
  expected?: CodeEditorExpected
  evaluatedValue: any
  widgetProperties: any
  useValidationMessage?: boolean
  parentPropertyName: string
  parentPropertyValue: unknown
  additionalDynamicData: Record<string, Record<string, unknown>>
  label: string
  additionalControlData?: Record<string, unknown>
}
export interface ControlFunctions {
  onPropertyChange?: (
    propertyName: string,
    propertyValue: string,
    isUpdatedViaKeyboard?: boolean,
  ) => void
  onBatchUpdateProperties?: (updates: Record<string, unknown>) => void
  openNextPanel: (props: any) => void
  deleteProperties: (propertyPaths: string[]) => void
  theme: EditorTheme
  hideEvaluatedValue?: boolean
}
export class BaseControl<P extends ControlProps, S = {}> extends Component<
  P,
  S
> {
  updateProperty(
    propertyName: string,
    propertyValue: any,
    isUpdatedViaKeyboard?: boolean,
  ) {
    if (
      this.props.propertyValue === undefined &&
      propertyValue === this.props.defaultValue
    ) {
      return
    }
    if (
      !_.isNil(this.props.onPropertyChange) &&
      this.props.propertyValue !== propertyValue
    ) {
      this.props.onPropertyChange(
        propertyName,
        propertyValue,
        isUpdatedViaKeyboard,
      )
    }
  }
  deleteProperties(propertyPaths: string[]) {
    if (this.props.deleteProperties) {
      this.props.deleteProperties(propertyPaths)
    }
  }
  batchUpdateProperties = (updates: Record<string, unknown>) => {
    if (this.props.onBatchUpdateProperties) {
      this.props.onBatchUpdateProperties(updates)
    }
  }
  static getControlType() {
    return 'BASE_CONTROL'
  }

  // Checks whether a particular value can be displayed UI from JS edit mode
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static canDisplayValueInUI(config: ControlData, value: any): boolean {
    return false
  }

  // Only applicable for JSONFormComputeControl & ComputeTablePropertyControl
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static getInputComputedValue(value: string, widgetName: string): string {
    return ''
  }
}
