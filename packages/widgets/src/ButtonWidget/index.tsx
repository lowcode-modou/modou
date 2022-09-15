import { FC } from 'react'
import { Button } from 'antd'
import { mr, JsonSchema7ObjectType, mrToJsonSchema } from '@modou/refine'

// props
// state
// readonly extra定义
// event 传递deep position

enum ButtonWidgetShapeEnum {
  Default = 'default',
  Circle = 'circle',
  round = 'round',
}

enum ButtonWidgetSizeEnum {
  Large = 'large',
  Middle = 'middle',
  Small = 'small',
}

enum ButtonWidgetTypeEnum {
  Primary = 'primary',
  Ghost = 'ghost',
  Dashed = 'dashed',
  Link = 'link',
  Text = 'text',
  Default = 'default'
}

const createMRWidgetProps = (widgetType: `${string}Widget`) => {
  return mr.object({
    widgetId: mr.string(),
    widgetType: mr.literal(widgetType)
  })
}

const MRButtonWidgetProps = createMRWidgetProps('ButtonWidget').extend({
  props: mr.object({
    block: mr.boolean().describe('将按钮宽度调整为其父宽度的选项').default(false),
    danger: mr.boolean().describe('设置危险按钮').default(false),
    disabled: mr.boolean().describe('按钮失效状态').default(false),
    ghost: mr.boolean().describe('幽灵属性，使按钮背景透明').default(false),
    href: mr.string().describe('点击跳转的地址，指定此属性 button 的行为和 a 链接一致').default(''),
    loading: mr.boolean().describe('设置按钮载入状态').default(false),
    shape: mr.nativeEnum(ButtonWidgetShapeEnum).describe('设置按钮形状').default(ButtonWidgetShapeEnum.Default),
    size: mr.nativeEnum(ButtonWidgetSizeEnum).describe('设置按钮大小').default(ButtonWidgetSizeEnum.Middle),
    type: mr.nativeEnum(ButtonWidgetTypeEnum).describe('设置按钮类型').default(ButtonWidgetTypeEnum.Default),
    title: mr.string().describe('按钮内容').default('按钮')
  })
})

const MRButtonWidgetState = MRButtonWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRButtonWidgetProps.shape.widgetId
  })
})

// metadata
// props
// state

interface ButtonWidgetMetadata {
  version: `${number}.${number}.${number}`
  widgetType: 'ButtonWidget'
  widgetName: '按钮'
  propsSchema: JsonSchema7ObjectType
}

type ButtonWidgetState = mr.infer<typeof MRButtonWidgetState>

export const buttonWidgetMetadata: ButtonWidgetMetadata = {
  version: '0.0.1',
  widgetType: 'ButtonWidget',
  widgetName: '按钮',
  // FIXME ts 类型
  propsSchema: mrToJsonSchema(MRButtonWidgetProps) as JsonSchema7ObjectType
}
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
  title
}) => {
  return <Button
    block={block}
    danger={danger}
    disabled={disabled}
    ghost={ghost}
    href={href}
    loading={loading}
    shape={shape}
    size={size}
    type={type}>{title}</Button>
}
