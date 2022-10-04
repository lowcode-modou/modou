import { mr } from '@modou/refine'
import { WidgetMetadata } from './WidgetMetadata'

export type WidgetBaseProps = mr.infer<ReturnType<typeof WidgetMetadata.createMRSchemeWidgetProps>>
& { props: Record<string, any> }
& { slots: Record<string, string[]> }
