import { mr, MRArray, MRString } from '@modou/refine'
import { MRWidgetProps, WidgetMetadata } from './WidgetMetadata'

export type WidgetBaseProps = mr.infer<
  ReturnType<
    typeof WidgetMetadata.createMRWidgetProps<
      MRWidgetProps,
      Record<string, MRArray<MRString>>
    >
  >
>
