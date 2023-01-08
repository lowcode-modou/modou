import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

import { WidgetIcon } from '../_'
import {
  RowWidgetAlignEnum,
  RowWidgetAlignOptions,
  RowWidgetJustifyEnum,
  RowWidgetJustifyOptions,
} from './constants'

export const MRSchemeRowWidgetProps = WidgetMetadata.createMRWidgetProps({
  type: 'RowWidget',
  name: '栅格行',
  props: {
    align: {
      def: mr.nativeEnum(RowWidgetAlignEnum).default(RowWidgetAlignEnum.Top),
      setter: {
        type: SetterTypeEnum.Select,
        label: '垂直对齐',
        description: '垂直对齐方式',
        options: RowWidgetAlignOptions,
      },
    },
    // gutter: mr.tuple([mr.number(), mr.number()]).or(mr.number()),
    justify: {
      def: mr
        .nativeEnum(RowWidgetJustifyEnum)
        .default(RowWidgetJustifyEnum.Start),
      setter: {
        type: SetterTypeEnum.Select,
        label: '水平排列',
        description: '水平排列方式',
        options: RowWidgetJustifyOptions,
      },
    },
    wrap: {
      def: mr.boolean().default(true),
      setter: {
        type: SetterTypeEnum.Boolean,
        label: '自动换行',
        description: '是否自动换行',
      },
    },
  },
  slots: {
    children: mr.array(mr.string()).default([]),
  },
})

export const MRSchemeRowWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeRowWidgetProps,
  {},
)

export const rowWidgetMetadata = WidgetMetadata.createMetadata<
  typeof MRSchemeRowWidgetProps,
  typeof MRSchemeRowWidgetState
>({
  version: '0.0.1',
  type: 'RowWidget',
  name: '栅格行',
  icon: <WidgetIcon type="row" />,
  mrPropsScheme: MRSchemeRowWidgetProps,
  mrStateScheme: MRSchemeRowWidgetState,
  slots: {
    children: {
      name: '默认插槽',
    },
  },
  setters: {},
  initState: ({ id }) => {
    return {
      instance: {
        id,
        widgetId: id,
        initialized: true,
      },
    }
  },
})
