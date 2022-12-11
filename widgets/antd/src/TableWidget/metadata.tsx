import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { SetterTypeEnum } from '@modou/setters'

// TODO 提起公共变量
import { ButtonWidgetSizeEnum, sizeOptions } from '../ButtonWidget/constants'
import { WidgetIcon } from '../_'
import { ColumnsSetter } from './setters/ColumnsSetter'
import { ColumnValueTypeEnum } from './types'

export const MRSchemeTableWidgetProps = WidgetMetadata.createMRWidgetProps({
  widgetType: 'TableWidget',
  widgetName: '表格',
  props: {
    dataSource: {
      def: mr.array(mr.object({})).default([]),
      setter: {
        type: SetterTypeEnum.Array,
        label: '数据源',
        description: '数据源',
      },
    },
    size: {
      def: mr
        .nativeEnum(ButtonWidgetSizeEnum)
        .describe('设置表格尺寸')
        .default(ButtonWidgetSizeEnum.Middle),
      setter: {
        type: SetterTypeEnum.Select,
        label: '大小',
        description: '设置表格尺寸',
        options: sizeOptions,
      },
    },
    columns: {
      def: mr
        .array(
          mr
            .object({
              dataIndex: mr.string(),
              title: mr.string(),
              valueType: mr.nativeEnum(ColumnValueTypeEnum),
              buildIn: mr.boolean().default(false),
            })
            .merge(mr.object({})),
        )
        .default([]),
      setter: {
        type: SetterTypeEnum.Array,
        label: '表格列',
        description: '表格列',
        native: 'ColumnsSetter',
      },
    },
  },
})

export const MRSchemeTableWidgetState = WidgetMetadata.createMRWidgetState(
  MRSchemeTableWidgetProps,
  {},
)

export const tableWidgetMetadata = WidgetMetadata.createMetadata<
  typeof MRSchemeTableWidgetProps,
  typeof MRSchemeTableWidgetState
>({
  version: '0.0.1',
  widgetType: 'TableWidget',
  widgetName: '表格',
  icon: <WidgetIcon type="col" />,
  slots: {},
  setters: {
    ColumnsSetter,
  },
  mrPropsScheme: MRSchemeTableWidgetProps,
  mrStateScheme: MRSchemeTableWidgetState,
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
