import {
  buttonWidgetMetadata,
  colWidgetMetadata,
  rowWidgetMetadata,
} from '@modou/widgets-antd'

import { WidgetBaseProps, WidgetMetadata } from '../../'
import { generateId } from '../../utils'

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

const MOCK_WIDGETS = [rowDSL, colDSL, buttonDSL]
const MOCK_ROOT_WIDGET_ID = MOCK_WIDGETS[0].id
const MOCK_PAGE_ID = 'MOCK_PAGE_ID'
export const MOCK_PAGES = [
  {
    name: '大漠孤烟直',
    id: MOCK_PAGE_ID,
    widgets: MOCK_WIDGETS,
    rootWidgetId: MOCK_ROOT_WIDGET_ID,
  },
  {
    name: '测试',
    id: MOCK_PAGE_ID + '___',
    widgets: MOCK_WIDGETS,
    rootWidgetId: MOCK_ROOT_WIDGET_ID,
  },
  {
    name: '长河落日圆',
    id: MOCK_PAGE_ID + '________',
    widgets: MOCK_WIDGETS,
    rootWidgetId: MOCK_ROOT_WIDGET_ID,
  },
]
