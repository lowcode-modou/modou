import { mr } from '@modou/refine'
import { Widget } from './Widget'

export type WidgetBaseProps = mr.infer<ReturnType<typeof Widget.createMRSchemeWidgetProps>>
& { props: Record<string, any> }
& { slots: Record<string, string[]> }
