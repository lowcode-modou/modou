import { WidgetBaseProps, WidgetMetadata } from '@modou/core'
import { generateId } from '@modou/core/src/utils'
import {
  buttonWidgetMetadata,
  colWidgetMetadata,
  rowWidgetMetadata,
} from '@modou/widgets'

const buttonDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(buttonWidgetMetadata.jsonPropsSchema),
  id: generateId(),
}

const colDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(colWidgetMetadata.jsonPropsSchema),
  id: generateId(),
  slots: {
    children: [buttonDSL.id],
  },
}

const rowDSL: WidgetBaseProps = {
  ...WidgetMetadata.mrSchemeToDefaultJson(rowWidgetMetadata.jsonPropsSchema),
  id: generateId(),
  slots: {
    children: [colDSL.id],
  },
}

export const MOCK_WIDGETS = [rowDSL, colDSL, buttonDSL]

export const MOCK_ROOT_WIDGET_ID = MOCK_WIDGETS[0].id
export const MOCK_PAGE_ID = 'MOCK_PAGE_ID'
