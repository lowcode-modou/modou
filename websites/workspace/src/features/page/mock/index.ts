import { buttonWidgetMetadata, colWidgetMetadata, rowWidgetMetadata } from '@modou/widgets'
import { atom } from 'recoil'
import { WidgetBaseProps, Widget } from '@modou/core'
import { generateId } from '@modou/core/src/utils'

const buttonDSL = {
  ...Widget.mrSchemeToDefaultJson(buttonWidgetMetadata.jsonPropsSchema),
  widgetId: generateId()
}

const colDSL = {
  ...Widget.mrSchemeToDefaultJson(colWidgetMetadata.jsonPropsSchema),
  widgetId: generateId(),
  slots: {
    children: [buttonDSL.widgetId]
  }
}

const rowDSL: WidgetBaseProps = {
  ...Widget.mrSchemeToDefaultJson(rowWidgetMetadata.jsonPropsSchema),
  widgetId: generateId(),
  slots: {
    children: [colDSL.widgetId]
  }
}

export const widgetsAtom = atom<WidgetBaseProps[]>({
  key: 'widgetsAtom',
  default: [
    rowDSL,
    colDSL,
    buttonDSL
  ]
})
