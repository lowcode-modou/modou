import { WidgetMetadata } from '@modou/core'
import { WidgetIcon } from '../_'
import { mr } from '@modou/refine'
import {
  ButtonWidgetShapeEnum,
  ButtonWidgetSizeEnum,
  ButtonWidgetTypeEnum,
  shapeOptions,
  sizeOptions,
  typeOptions,
} from './constants'
import { SetterTypeEnum } from '@modou/setters'

export const MRSchemeButtonWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'ButtonWidget',
  widgetName: '按钮',
  props: {
    block: {
      def: mr.boolean().default(false),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '宽度100%',
        description: '将按钮宽度调整为其父宽度的选项',
      },
    },
    danger: {
      def: mr.boolean().default(false),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '危险',
        description: '设置危险按钮',
      },
    },
    disabled: {
      def: mr.boolean().default(false),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '失效',
        description: '按钮失效状态',
      },
    },
    ghost: {
      def: mr.boolean().default(false),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '幽灵',
        description: '幽灵属性，使按钮背景透明',
      },
    },
    // href: mrStringSetter(mr.string(), {
    //   label: '跳转链接',
    //   description: '点击跳转的地址，指定此属性 button 的行为和 a 链接一致'
    // }),
    loading: {
      def: mr.boolean().default(false),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '加载状态',
        description: '设置按钮载入状态',
      },
    },
    shape: {
      def: mr
        .nativeEnum(ButtonWidgetShapeEnum)
        .default(ButtonWidgetShapeEnum.Default),
      setter: {
        type: SetterTypeEnum.Select,
        label: '形状',
        description: '设置按钮形状',
        options: shapeOptions,
      },
    },
    size: {
      def: mr
        .nativeEnum(ButtonWidgetSizeEnum)
        .describe('设置按钮大小')
        .default(ButtonWidgetSizeEnum.Middle),
      setter: {
        type: SetterTypeEnum.Select,
        label: '大小',
        description: '设置按钮大小',
        options: sizeOptions,
      },
    },
    type: {
      def: mr
        .nativeEnum(ButtonWidgetTypeEnum)
        .default(ButtonWidgetTypeEnum.Default),
      setter: {
        type: SetterTypeEnum.Select,
        label: '类型',
        description: '设置按钮类型',
        options: typeOptions,
      },
    },
    title: {
      def: mr.string().default('按钮'),
      setter: {
        type: SetterTypeEnum.String,
        label: '内容',
        description: '按钮内容',
      },
    },
  },
})

export const MRSchemeButtonWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeButtonWidgetProps,
)

export const buttonWidgetMetadata = WidgetMetadata.createMetadata({
  version: '0.0.1',
  widgetType: 'ButtonWidget',
  widgetName: '按钮',
  icon: <WidgetIcon type="button" />,
  mrPropsScheme: MRSchemeButtonWidgetProps,
  slots: {},
})
