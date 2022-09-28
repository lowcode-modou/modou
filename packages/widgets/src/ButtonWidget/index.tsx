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
  widgetName: '按钮'
}).extend({
  props: mr.object({
    block: mr.boolean().default(false)._extra(mrBooleanSetter({
      label: '宽度100%',
      description: '将按钮宽度调整为其父宽度的选项'
    })),
    danger: mr.boolean().default(false)._extra(mrBooleanSetter({
      label: '危险',
      description: '设置危险按钮'
    })),
    disabled: mr.boolean().default(false)._extra(mrBooleanSetter({
      label: '失效',
      description: '按钮失效状态'
    })),
    ghost: mr.boolean().default(false)._extra(mrBooleanSetter({
      label: '幽灵',
      description: '幽灵属性，使按钮背景透明'
    })),
    // href: mrStringSetter(mr.string(), {
    //   label: '跳转链接',
    //   description: '点击跳转的地址，指定此属性 button 的行为和 a 链接一致'
    // }),
    loading: mr.boolean().default(false)._extra(mrBooleanSetter({
      label: '加载状态',
      description: '设置按钮载入状态'
    })),
    shape: mr
      .nativeEnum(ButtonWidgetShapeEnum)
      .default(ButtonWidgetShapeEnum.Default)._extra(mrSelectSetter(
        {
          label: '形状',
          description: '设置按钮形状',
          options: shapeOptions
        }
      )),
    size: mr
      .nativeEnum(ButtonWidgetSizeEnum)
      .describe('设置按钮大小')
      .default(ButtonWidgetSizeEnum.Middle)._extra(mrSelectSetter(
        {
          label: '大小',
          description: '设置按钮大小',
          options: sizeOptions
        }
      )),
    type: mr
      .nativeEnum(ButtonWidgetTypeEnum)
      .default(ButtonWidgetTypeEnum.Default)._extra(mrSelectSetter(
        {
          label: '类型',
          description: '设置按钮类型',
          options: typeOptions
        }
      )),
    title: mr.string().default('按钮')._extra(mrStringSetter({
      label: '内容',
      description: '按钮内容'
    }))
  })
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
  mrPropsScheme: MRSchemeButtonWidgetProps,
  slots: {}
})

console.log('buttonWidgetMetadata', buttonWidgetMetadata)

export const ButtonWidget: FC<ButtonWidgetState> = ({
  block,
  danger,
  disabled,
  ghost,
  // href,
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
      // href={href === '' ? undefined : href}
      loading={loading}
      shape={shape}
      size={size}
      type={type}
    >
      {title}
    </Button>
  )
}
