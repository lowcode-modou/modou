import { schemeToJsonDefault } from '@modou/refine'
import {
  buttonWidgetMetadata,
  rowWidgetMetadata,
  colWidgetMetadata,
  RowWidget,
  ColWidget,
  ButtonWidget
} from '@modou/widgets'
import { atom, useRecoilValue } from 'recoil'
import { FC } from 'react'
import { match } from 'ts-pattern'

const rowDSL = {
  ...schemeToJsonDefault(rowWidgetMetadata.jsonPropsSchema),
  widgetId: 'rowDSL',
  slots: {
    children: ['colDSL']
  }
}
const colDSL = {
  ...schemeToJsonDefault(colWidgetMetadata.jsonPropsSchema),
  widgetId: 'colDSL',
  slots: {
    children: ['buttonDSL']
  }
}
const buttonDSL = {
  ...schemeToJsonDefault(buttonWidgetMetadata.jsonPropsSchema),
  widgetId: 'buttonDSL'
}

export const testRender = () => {
  console.log(
    'rowDSL',
    rowDSL,
    colDSL,
    buttonDSL
  )
}

export const widgetByIdAtom = atom({
  key: 'widgetByIdAtom',
  default: {
    rowDSL,
    colDSL,
    buttonDSL
  }
})

const ROOT_WIDGET_ID = 'rowDSL'

const WidgetWrapper: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const widgetDSLById: any = useRecoilValue(widgetByIdAtom)
  const widgetDSL = widgetDSLById[widgetId]
  const Widget: any = match(widgetDSL.widgetType)
    .with('RowWidget', () => RowWidget)
    .with('ColWidget', () => ColWidget)
    .with('ButtonWidget', () => ButtonWidget)
    .exhaustive()

  const renderSlots = Object.entries((widgetDSL.slots || {})).map(([key, value]) => {
    return [key, <WidgetWrapper key={key} widgetId={value as string} />]
  }).reduce((pre, cur) => {
    // @ts-expect-error
    pre[cur[0]] = cur[1]
    return pre
  }, {})

  return <Widget {...widgetDSL.props} renderSlots={renderSlots}/>
}

export const MoDouRender: FC = () => {
  return <div>
    <WidgetWrapper widgetId={ROOT_WIDGET_ID} />
  </div>
}
