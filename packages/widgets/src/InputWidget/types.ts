import { WidgetMetadata } from '@modou/core'
import { mr } from '@modou/refine'
import { mrStringSetter } from '@modou/setters'

export const MRSchemeInputWidgetProps =
  WidgetMetadata.createMRSchemeWidgetProps({
    widgetType: 'InputWidget',
    widgetName: '输入框',
  }).extend({
    props: mr.object({
      label: mr
        .string()
        .default('标签')
        ._extra(
          mrStringSetter({
            label: '标签',
            description: '标签的文本',
          }),
        ),
      defaultValue: mr
        .string()
        .default('')
        ._extra(
          mrStringSetter({
            label: '默认值',
            description: '输入框默认内容',
          }),
        ),
    }),
  })

const MRSchemeInputWidgetState = MRSchemeInputWidgetProps.shape.props.extend({
  instance: mr.object({
    id: mr.string(),
    widgetId: MRSchemeInputWidgetProps.shape.widgetId,
  }),
  widgetName: MRSchemeInputWidgetProps.shape.widgetName,
})

export type InputWidgetState = mr.infer<typeof MRSchemeInputWidgetState>
