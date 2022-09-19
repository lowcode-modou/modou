import { mr } from '@modou/refine'
import { Widget } from './Widget'

export type WidgetBaseProps = mr.infer<ReturnType<typeof Widget.createMRSchemeWidgetProps<any>>>
