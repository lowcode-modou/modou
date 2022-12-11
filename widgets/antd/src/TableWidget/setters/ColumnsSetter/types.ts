import { InterWidgetProps } from '../../../_'
import { MRSchemeTableWidgetProps } from '../../metadata'

export type TableWidgetColumn = InterWidgetProps<
  typeof MRSchemeTableWidgetProps
>['props']['columns'][0]
