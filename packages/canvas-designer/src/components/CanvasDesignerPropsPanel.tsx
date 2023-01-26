import { Button, Divider, Form, Input } from 'antd'
import { omit } from 'lodash'
import {
  ComponentProps,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { AppFactoryContext } from '@modou/core'
import { cx, mcss } from '@modou/css-in-js'
import { toJS } from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'
import { SETTER_KEY } from '@modou/setters'
import { SetterTypeEnum } from '@modou/setters/src/constants'
import { BaseMRSetterOptions } from '@modou/setters/src/types'

import { useCanvasDesignerFile } from '../contexts/CanvasDesignerFileContext'
import { useCanvasDesignerStore } from '../contexts/CanvasDesignerStoreContext'

const useRenderFormItem = ({ widgetId }: { widgetId: string }) => {
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const widget = canvasDesignerFile.widgetMap[widgetId]
  const widgetFactory = useContext(AppFactoryContext)
  const widgetMetadata = useMemo(() => {
    return widgetFactory.widgetByType[widget.meta.type].metadata
  }, [widgetFactory.widgetByType, widget.meta.type])
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
            <NativeSetter widget={widget} />
          ) : (
            <Setter
              options={setterOptions}
              value={toJS(widget.meta.props[key])}
              onChange={(value: any) => {
                widget.updateMeta((preValue) => ({
                  ...preValue,
                  props: {
                    ...preValue.props,
                    [key]: value,
                  },
                }))
              }}
            />
          )}
        </Form.Item>
      )
    })
  return {
    formRender,
    widgetMetadata,
    widget,
  }
}

const _WidgetPropsPanel: FC = () => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const isRootWidget =
    canvasDesignerStore.selectedWidgetId ===
    canvasDesignerFile.meta.rootWidgetId

  const { widgetMetadata, formRender, widget } = useRenderFormItem({
    widgetId: canvasDesignerStore.selectedWidgetId,
  })

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
        <Input readOnly value={canvasDesignerStore.selectedWidgetId} />
      </Form.Item>
      <Form.Item label="组件类型">
        <Input readOnly value={widgetMetadata.name} />
      </Form.Item>
      <Form.Item label="组件名称">
        <BlurInput
          value={widget.meta.name}
          onChange={(value) => {
            widget.updateMeta((prevValue) => ({
              ...prevValue,
              name: value,
            }))
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
              canvasDesignerFile.deleteWidget(
                canvasDesignerStore.selectedWidgetId,
              )
              canvasDesignerStore.setSelectedWidgetId('')
            }}
          >
            删除
          </Button>
        </Form.Item>
      )}
    </Form>
  )
}

const WidgetPropsPanel = observer(_WidgetPropsPanel)
const _PagePropsPanel: FC = () => {
  const { canvasDesignerFile } = useCanvasDesignerFile()
  return (
    <Form className={classes.form} labelWrap size={'small'}>
      <Form.Item label="页面名称">
        <BlurInput
          onChange={(value) => {
            canvasDesignerFile.updateMeta((preValue) => ({
              ...preValue,
              name: value,
            }))
          }}
          value={canvasDesignerFile.meta.name}
        />
      </Form.Item>
    </Form>
  )
}
const PagePropsPanel = observer(_PagePropsPanel)

const _CanvasDesignerPropsPanel: FC = () => {
  const { canvasDesignerStore } = useCanvasDesignerStore()
  return (
    <div className={classes.wrapper}>
      {canvasDesignerStore.selectedWidgetId ? (
        <WidgetPropsPanel />
      ) : (
        <PagePropsPanel />
      )}
    </div>
  )
}

export const CanvasDesignerPropsPanel = observer(_CanvasDesignerPropsPanel)

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
  Omit<ComponentProps<typeof Input>, 'onChange' | 'value'> & {
    onChange: (value: string) => void
    value: string
  }
> = (props) => {
  const [tempValue, setTempValue] = useState(props.value)
  const [focus, setFocus] = useState(false)
  const widgetName = focus ? tempValue : props.value

  useEffect(() => {
    setTempValue(props.value)
  }, [props.value])

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
