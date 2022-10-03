import { FC, useContext, useMemo } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { selectedWidgetIdAtom, widgetByIdSelector, widgetsSelector } from '../store'
import { SETTER_KEY } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseMRSetterOptions } from '@modou/setters/src/types'
import { Button, Form, Typography } from 'antd'
import { WidgetFactoryContext } from '@modou/core'
import { useRemoveWidget } from '../hooks'

const WithSelectedWidgetId: FC = () => {
  const widgetById = useRecoilValue(widgetByIdSelector)
  const [selectedWidgetId, setSelectedWidgetId] = useRecoilState(selectedWidgetIdAtom)
  const selectWidget = widgetById[selectedWidgetId]
  // const designerContext = useContext(DesignerContext)
  const setWidgets = useSetRecoilState(widgetsSelector)

  const widgetFactory = useContext(WidgetFactoryContext)

  const widgetMetadata = useMemo(() => {
    return widgetFactory.widgetByType[selectWidget.widgetType].metadata
  }, [widgetFactory.widgetByType, selectWidget.widgetType])

  const { removeWidget } = useRemoveWidget()

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
      <Form.Item>
        <Button
          block
          danger
          onClick={() => {
            removeWidget(selectedWidgetId)
            setSelectedWidgetId('')
          }}
        >删除</Button>
      </Form.Item>
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
