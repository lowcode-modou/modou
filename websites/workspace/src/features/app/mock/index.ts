import {
  buttonWidgetMetadata,
  colWidgetMetadata,
  rowWidgetMetadata,
} from '@modou/widgets'
import { WidgetBaseProps, WidgetMetadata } from '@modou/core'
import { generateId } from '@modou/core/src/utils'

const buttonDSL = {
  ...WidgetMetadata.mrSchemeToDefaultJson(buttonWidgetMetadata.jsonPropsSchema),
  widgetId: generateId(),
}

const colDSL = {
  ...WidgetMetadata.mrSchemeToDefaultJson(colWidgetMetadata.jsonPropsSchema),
  widgetId: generateId(),
  slots: {
    children: [buttonDSL.widgetId],
  },
}

const rowDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(rowWidgetMetadata.jsonPropsSchema),
  widgetId: generateId(),
  slots: {
    children: [colDSL.widgetId],
  },
}

export const MOCK_WIDGETS = [rowDSL, colDSL, buttonDSL]

export const MOCK_ROOT_WIDGET_ID = MOCK_WIDGETS[0].widgetId
export const MOCK_PAGE_ID = 'MOCK_PAGE_ID'
