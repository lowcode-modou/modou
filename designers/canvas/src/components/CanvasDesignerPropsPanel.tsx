import { FC, useContext, useMemo } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import {
  isRootWidgetSelector,
  pageSelector,
  selectedWidgetIdAtom,
  widgetByIdSelector,
  widgetSelector,
} from '../store'
import { SETTER_KEY } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseMRSetterOptions } from '@modou/setters/src/types'
import { Button, Divider, Form, Input, Typography } from 'antd'
import { AppFactoryContext } from '@modou/core'
import { useRemoveWidget } from '../hooks'
import produce from 'immer'
import './CanvasDesignerPropsPanel.scss'

const WidgetPropsPanel: FC = () => {
  const widgetById = useRecoilValue(widgetByIdSelector)
  const [selectedWidgetId, setSelectedWidgetId] =
    useRecoilState(selectedWidgetIdAtom)
  const selectWidget = widgetById[selectedWidgetId]
  const setWidget = useSetRecoilState(widgetSelector(selectedWidgetId))
  const isRootWidget = useRecoilValue(isRootWidgetSelector(selectedWidgetId))
  const widgetFactory = useContext(AppFactoryContext)
  const widgetMetadata = useMemo(() => {
    return widgetFactory.widgetByType[selectWidget.widgetType].metadata
  }, [widgetFactory.widgetByType, selectWidget.widgetType])

  const { removeWidget } = useRemoveWidget()

  const render = Object.entries(
    (
      widgetMetadata.jsonPropsSchema.properties
        .props as unknown as typeof widgetMetadata.jsonPropsSchema
    ).properties,
  )
    .filter(([, value]) => Reflect.has(value, SETTER_KEY))
    .map(([key, value]) => {
      const setterOptions: BaseMRSetterOptions & { type: SetterTypeEnum } =
        Reflect.get(value, SETTER_KEY)
      const Setter = widgetFactory.setterByType[setterOptions.type]
      return (
        <Form.Item
          tooltip={setterOptions.description}
          key={key}
          label={setterOptions.label}
        >
          <Setter
            options={setterOptions}
            value={selectWidget.props[key]}
            onChange={(value: any) => {
              setWidget(
                produce((draft) => {
                  draft.props[key] = value
                }),
              )
            }}
          />
        </Form.Item>
      )
    })

  return (
    <Form
      // labelCol={{ span: 10 }}
      // wrapperCol={{ span: 14 }}
      className="CanvasDesignerPropsPanel"
      labelWrap
      size={'small'}
    >
      <Form.Item label="组件类型">
        <Typography.Text>{widgetMetadata.widgetName}</Typography.Text>
      </Form.Item>
      <Form.Item label="组件名称">
        <Input
          value={selectWidget.widgetName}
          onChange={(e) => {
            setWidget(
              produce((draft) => {
                draft.widgetName = e.target.value
              }),
            )
          }}
          placeholder="请输入组件名称"
        />
      </Form.Item>
      <Divider style={{ margin: '8px 0' }} />
      {render}
      {!isRootWidget && (
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            block
            danger
            onClick={() => {
              removeWidget(selectedWidgetId)
              setSelectedWidgetId('')
            }}
          >
            删除
          </Button>
        </Form.Item>
      )}
    </Form>
  )
}
const PagePropsPanel: FC = () => {
  const [page, setPage] = useRecoilState(pageSelector)
  return (
    <Form className="CanvasDesignerPropsPanel" labelWrap size={'small'}>
      <Form.Item label="页面名称">
        <Input
          onChange={(e) => {
            setPage(
              produce((draft) => {
                draft.name = e.target.value
              }),
            )
          }}
          value={page.name}
        />
      </Form.Item>
    </Form>
  )
}

export const CanvasDesignerPropsPanel: FC = () => {
  const selectedWidgetId = useRecoilValue(selectedWidgetIdAtom)
  return (
    <div style={{ padding: '16px' }}>
      {selectedWidgetId ? <WidgetPropsPanel /> : <PagePropsPanel />}
    </div>
  )
}
