import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { mrBooleanSetter, mrSelectSetter, mrStringSetter } from '@modou/setters'
import {
  ButtonWidgetShapeEnum,
  ButtonWidgetSizeEnum,
  ButtonWidgetTypeEnum,
  shapeOptions,
  sizeOptions,
  typeOptions
} from './constants'

export const MRSchemeButtonWidgetProps = WidgetMetadata.createMRSchemeWidgetProps({
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
export type ButtonWidgetState = mr.infer<typeof MRSchemeButtonWidgetState>
