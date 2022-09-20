import { FC, useContext } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedWidgetIdAtom, widgetByIdSelector, widgetsAtom } from '../store'
import { match } from 'ts-pattern'
import { buttonWidgetMetadata, colWidgetMetadata, rowWidgetMetadata } from '@modou/widgets'
import { BooleanSetter, NumberSetter, SelectSetter, SETTER_KEY, StringSetter } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseSetterProps } from '@modou/setters/src/types'
import { Form } from 'antd'
// import { DesignerContext } from '../contexts'

const WithSelectedWidgetId: FC = () => {
  const widgetById = useRecoilValue(widgetByIdSelector)
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  const selectWidget = widgetById[selectedWidgetId]
  // const designerContext = useContext(DesignerContext)
  const setWidgets = useSetRecoilState(widgetsAtom)

  const metadata = match<string>(selectWidget.widgetType)
    .with('RowWidget', () => rowWidgetMetadata)
    .with('ColWidget', () => colWidgetMetadata)
    .with('ButtonWidget', () => buttonWidgetMetadata)
    .run()

  const render = Object.entries(
    (metadata.jsonPropsSchema.properties.props as typeof metadata.jsonPropsSchema).properties
  )
    .filter(([, value]) => Reflect.has(value, SETTER_KEY))
    .map(([key, value]) => {
      const setterOptions = Reflect.get(value, SETTER_KEY)
      const Setter: FC<BaseSetterProps<any>> = match(setterOptions.type)
        .with(SetterTypeEnum.Number, () => NumberSetter)
        .with(SetterTypeEnum.Boolean, () => BooleanSetter)
        .with(SetterTypeEnum.Select, () => SelectSetter)
        .with(SetterTypeEnum.String, () => StringSetter)
        .exhaustive()
      return <Form.Item key={key} label={key}>
        <Setter
          options={setterOptions}
          value={selectWidget.props[key]}
          onChange={(value: any) => {
            setWidgets(Object.values({
              ...widgetById,
              [selectedWidgetId]: {
                ...selectWidget,
                props: {
                  ...selectWidget.props,
                  [key]: value
                }
              }
            }))
          }}
        />
      </Form.Item>
    })

  return selectedWidgetId
    ? <Form size={'small'}>
      {render}
    </Form>
    : <div>Empty</div>
}
const WithoutSelectedWidgetId: FC = () => {
  return <div>Empty</div>
}

export const CanvasDesignerPropsPanel: FC = () => {
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  return selectedWidgetId ? <WithSelectedWidgetId /> : <WithoutSelectedWidgetId />
}
