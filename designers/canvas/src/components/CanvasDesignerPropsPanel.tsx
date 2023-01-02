import { Button, Divider, Form, Input } from 'antd'
import produce from 'immer'
import { omit } from 'lodash'
import { ComponentProps, FC, useContext, useMemo, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { AppFactoryContext } from '@modou/core'
import { cx, mcss } from '@modou/css-in-js'
import { SETTER_KEY } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseMRSetterOptions } from '@modou/setters/src/types'

import { useRemoveWidget } from '../hooks'
import {
  isRootWidgetSelector,
  pageSelector,
  selectedWidgetIdAtom,
  widgetSelector,
} from '../store'

const useRenderFormItem = ({ widgetId }: { widgetId: string }) => {
  const [widget, setWidget] = useRecoilState(widgetSelector(widgetId))
  const widgetFactory = useContext(AppFactoryContext)
  const widgetMetadata = useMemo(() => {
    return widgetFactory.widgetByType[widget.widgetType].metadata
  }, [widgetFactory.widgetByType, widget.widgetType])
  const propsDef = (
    widgetMetadata.jsonPropsSchema.properties
      .props as unknown as typeof widgetMetadata.jsonPropsSchema
  ).properties

  const formRender = Object.entries(propsDef)
    .filter(([, value]) => Reflect.has(value, SETTER_KEY))
    .map(([key, value]) => {
      const setterOptions: BaseMRSetterOptions & { type: SetterTypeEnum } =
        Reflect.get(value, SETTER_KEY)
      const Setter = widgetFactory.setterByType[setterOptions.type]
      const NativeSetter = widgetMetadata.setters?.[setterOptions.native ?? '']
      return (
        <Form.Item
          tooltip={setterOptions.description}
          key={key}
          label={setterOptions.label}
        >
          {NativeSetter ? (
            <NativeSetter
              value={widget.props[key]}
              onChange={(value: any) => {
                setWidget(
                  produce((draft) => {
                    draft.props[key] = value
                  }),
                )
              }}
            />
          ) : (
            <Setter
              options={setterOptions}
              value={widget.props[key]}
              onChange={(value: any) => {
                setWidget(
                  produce((draft) => {
                    draft.props[key] = value
                  }),
                )
              }}
            />
          )}
        </Form.Item>
      )
    })
  return {
    formRender,
    setWidget,
    widgetMetadata,
    widget,
  }
}

const WidgetPropsPanel: FC = () => {
  const [selectedWidgetId, setSelectedWidgetId] =
    useRecoilState(selectedWidgetIdAtom)
  const isRootWidget = useRecoilValue(isRootWidgetSelector(selectedWidgetId))

  const { setWidget, widgetMetadata, formRender, widget } = useRenderFormItem({
    widgetId: selectedWidgetId,
  })

  const { removeWidget } = useRemoveWidget()

  const [tempWidgetName, setWidgetTempName] = useState(widget.widgetName)
  const [widgetNameFocus, setWidgetNameFocus] = useState(false)
  const widgetName = widgetNameFocus ? tempWidgetName : widget.widgetName

  return (
    <Form
      // labelCol={{ span: 10 }}
      // wrapperCol={{ span: 14 }}
      className={classes.form}
      labelWrap
      size={'small'}
      layout={'vertical'}
    >
      <Form.Item label="组件ID">
        <Input readOnly value={selectedWidgetId} />
      </Form.Item>
      <Form.Item label="组件类型">
        <Input readOnly value={widgetMetadata.widgetName} />
      </Form.Item>
      <Form.Item label="组件名称">
        <BlurInput
          value={widgetName}
          onChange={(value) => {
            setWidget(
              produce((draft) => {
                draft.widgetName = value
              }),
            )
          }}
          placeholder="请输入组件名称"
        />
      </Form.Item>
      <Divider style={{ margin: '8px 0' }} />
      {formRender}
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
    <Form className={classes.form} labelWrap size={'small'}>
      <Form.Item label="页面名称">
        <BlurInput
          onChange={(value) => {
            setPage(
              produce((draft) => {
                draft.name = value
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
    <div className={classes.wrapper}>
      {selectedWidgetId ? <WidgetPropsPanel /> : <PagePropsPanel />}
    </div>
  )
}

const classes = {
  wrapper: mcss`
    padding: 16px;
  `,
  form: mcss`
    & .ant-form-item {
      margin-bottom: 12px !important;

      &-control-input-content {
        justify-content: flex-end !important;

        .ant-input-number {
          flex: 1 !important;
        }
      }
    }

    .ant-row {
      &.ant-form-item-row {
        .ant-form-item-label {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    *[readonly]{
      border: none;
    }
  `,
}

const BlurInput: FC<
  Omit<ComponentProps<typeof Input>, 'onChange'> & {
    onChange: (value: string) => void
  }
> = (props) => {
  const [tempValue, setTempValue] = useState('')
  const [focus, setFocus] = useState(false)
  const widgetName = focus ? tempValue : props.value

  return (
    <Input
      {...omit(props, 'onChange')}
      className={cx(blurInputStyle, props.className)}
      readOnly={!focus}
      value={widgetName}
      onBlur={() => {
        setFocus(false)
        props.onChange(tempValue)
      }}
      onClick={() => setFocus(true)}
      onChange={(e) => {
        setTempValue(e.target.value)
      }}
    />
  )
}

const blurInputStyle = mcss`
  &[readonly]{
    cursor: pointer;
    border: none;
  }
`
