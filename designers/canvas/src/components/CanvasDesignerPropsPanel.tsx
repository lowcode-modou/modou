import { Button, Divider, Form, Input, Typography } from 'antd'
import produce from 'immer'
import { FC, useContext, useMemo } from 'react'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { AppFactoryContext } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { SETTER_KEY } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseMRSetterOptions } from '@modou/setters/src/types'

import { useRemoveWidget } from '../hooks'
import {
  isRootWidgetSelector,
  pageSelector,
  selectedWidgetIdAtom,
  widgetByIdSelector,
  widgetSelector,
} from '../store'

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
      className={classes.panel}
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
            type={'primary'}
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
    <Form className={classes.panel} labelWrap size={'small'}>
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

const classes = {
  panel: mcss`
		& .ant-form-item {
			margin-bottom: 12px !important;
			&-control-input-content {
				justify-content: flex-end !important;
				.ant-input-number {
					flex: 1 !important;
				}
			}
		}
  `,
}
