import { FC, useContext, useMemo } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedWidgetIdAtom, widgetByIdSelector, widgetsAtom } from '../store'
import { SETTER_KEY } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseMRSetterOptions } from '@modou/setters/src/types'
import { Form, Typography } from 'antd'
import { WidgetFactoryContext } from '@modou/core'

const WithSelectedWidgetId: FC = () => {
  const widgetById = useRecoilValue(widgetByIdSelector)
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  const selectWidget = widgetById[selectedWidgetId]
  // const designerContext = useContext(DesignerContext)
  const setWidgets = useSetRecoilState(widgetsAtom)

  const widgetFactory = useContext(WidgetFactoryContext)

  const widgetMetadata = useMemo(() => {
    return widgetFactory.widgetByType[selectWidget.widgetType].metadata
  }, [widgetFactory.widgetByType, selectWidget.widgetType])

  const render = Object.entries(
    (widgetMetadata.jsonPropsSchema.properties.props as unknown as typeof widgetMetadata.jsonPropsSchema).properties
  )
    .filter(([, value]) => Reflect.has(value, SETTER_KEY))
    .map(([key, value]) => {
      const setterOptions: BaseMRSetterOptions & { type: SetterTypeEnum } = Reflect.get(value, SETTER_KEY)
      const Setter = widgetFactory.setterByType[setterOptions.type]
      return <Form.Item
      tooltip={setterOptions.description}
      key={key}
      label={setterOptions.label}>
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
      <div className='text-center'>
        <Typography.Text
          type={'success'}>{selectedWidgetId}</Typography.Text>
      </div>
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
