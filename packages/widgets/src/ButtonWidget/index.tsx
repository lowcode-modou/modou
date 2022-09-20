import { FC, useEffect } from 'react'
import { Button } from 'antd'
import { mr } from '@modou/refine'
import { mrBooleanSetter, mrSelectSetter, mrStringSetter } from '@modou/setters'
import { Widget } from '@modou/core'
import { MRSelectOptions } from '../_'

// props
// state
// readonly extra定义
// event 传递deep position

enum ButtonWidgetShapeEnum {
  Default = 'default',
  Circle = 'circle',
  Round = 'round',
}

enum ButtonWidgetSizeEnum {
  Large = 'large',
  Middle = 'middle',
  Small = 'small',
}

enum ButtonWidgetTypeEnum {
  Primary = 'primary',
  Dashed = 'dashed',
  Link = 'link',
  Text = 'text',
  Default = 'default',
}

const shapeOptions: MRSelectOptions = [
  {
    label: '默认',
    value: ButtonWidgetShapeEnum.Default
  },
  {
    label: '圆角',
    value: ButtonWidgetShapeEnum.Round
  },
  {
    label: '圆形',
    value: ButtonWidgetShapeEnum.Circle
  }
]

const sizeOptions: MRSelectOptions = [
  {
    label: '正常',
    value: ButtonWidgetSizeEnum.Middle
  },
  {
    label: '大',
    value: ButtonWidgetSizeEnum.Large
  },
  {
    label: '小',
    value: ButtonWidgetSizeEnum.Small
  }
]

const typeOptions: MRSelectOptions = [
  {
    label: '默认按钮',
    value: ButtonWidgetTypeEnum.Default
  },
  {
    label: '主按钮',
    value: ButtonWidgetTypeEnum.Primary
  },
  {
    label: '文本按钮',
    value: ButtonWidgetTypeEnum.Text
  },
  {
    label: '连接按钮',
    value: ButtonWidgetTypeEnum.Link
  },
  {
    label: '虚线按钮',
    value: ButtonWidgetTypeEnum.Dashed
  }
]

const MRSchemeButtonWidgetProps = Widget.createMRSchemeWidgetProps({
  widgetType: 'ButtonWidget',
  widgetName: '按钮',
  props: {
    block: mrBooleanSetter(mr.boolean().describe('将按钮宽度调整为其父宽度的选项').default(false)),
    danger: mrBooleanSetter(mr.boolean().describe('设置危险按钮').default(false)),
    disabled: mrBooleanSetter(mr.boolean().describe('按钮失效状态').default(false)),
    ghost: mrBooleanSetter(mr.boolean().describe('幽灵属性，使按钮背景透明').default(false)),
    href: mrStringSetter(
      mr.string().describe('点击跳转的地址，指定此属性 button 的行为和 a 链接一致')
    ),
    loading: mrBooleanSetter(mr.boolean().describe('设置按钮载入状态').default(false)),
    shape: mrSelectSetter(
      mr
        .nativeEnum(ButtonWidgetShapeEnum)
        .describe('设置按钮形状')
        .default(ButtonWidgetShapeEnum.Default),
      {
        options: shapeOptions
      }
    ),
    size: mrSelectSetter(
      mr
        .nativeEnum(ButtonWidgetSizeEnum)
        .describe('设置按钮大小')
        .default(ButtonWidgetSizeEnum.Middle),
      {
        options: sizeOptions
      }
    ),
    type: mrSelectSetter(
      mr
        .nativeEnum(ButtonWidgetTypeEnum)
        .describe('设置按钮类型')
        .default(ButtonWidgetTypeEnum.Default),
      {
        options: typeOptions
      }
    ),
    title: mrStringSetter(mr.string().describe('按钮内容').default('按钮'))
  },
  slots: {}
})

const MRSchemeButtonWidgetState = MRSchemeButtonWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeButtonWidgetProps.shape.widgetId
  }),
  widgetName: MRSchemeButtonWidgetProps.shape.widgetName
})

type ButtonWidgetState = mr.infer<typeof MRSchemeButtonWidgetState>

export const buttonWidgetMetadata = Widget.createMetadata({
  version: '0.0.1',
  widgetType: 'ButtonWidget',
  widgetName: '按钮',
  mrPropsScheme: MRSchemeButtonWidgetProps
})

export const ButtonWidget: FC<ButtonWidgetState> = ({
  block,
  danger,
  disabled,
  ghost,
  href,
  loading,
  shape,
  size,
  type,
  title,
  instance
}) => {
  useEffect(() => {
    console.log('我是按钮 我重新渲染了', block)
  })
  return (
    <Button
      data-widget-id={instance.widgetId}
      block={block}
      danger={danger}
      disabled={disabled}
      ghost={ghost}
      href={href}
      loading={loading}
      shape={shape}
      size={size}
      type={type}
    >
      {title}
    </Button>
  )
}
