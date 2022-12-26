import {
  RenderMode,
  WidgetType,
} from '@modou/code-editor/CodeEditor/constants/WidgetConstants'
import { DataTreeWidget } from '@modou/code-editor/CodeEditor/entities/DataTree/dataTreeFactory'
import {
  DataTreeEvaluationProps,
  WidgetDynamicPathListProps,
} from '@modou/code-editor/CodeEditor/utils/DynamicBindingUtils'

export interface WidgetRowCols {
  leftColumn: number
  rightColumn: number
  topRow: number
  bottomRow: number
  minHeight?: number // Required to reduce the size of CanvasWidgets.
  height?: number
}
export interface WidgetPositionProps extends WidgetRowCols {
  parentColumnSpace: number
  parentRowSpace: number
  // The detachFromLayout flag tells use about the following properties when enabled
  // 1) Widget does not drag/resize
  // 2) Widget CAN (but not neccessarily) be a dropTarget
  // Examples: MainContainer is detached from layout,
  // MODAL_WIDGET is also detached from layout.
  detachFromLayout?: boolean
  noContainerOffset?: boolean // This won't offset the child in parent
}
export interface WidgetBaseProps {
  widgetId: string
  type: WidgetType
  widgetName: string
  parentId?: string
  renderMode: RenderMode
  version: number
  childWidgets?: DataTreeWidget[]
}
export interface WidgetDisplayProps {
  // TODO: Some of these props are mandatory
  isVisible?: boolean
  isLoading: boolean
  isDisabled?: boolean
  backgroundColor?: string
  animateLoading?: boolean
}
export interface WidgetDataProps
  extends WidgetBaseProps,
    WidgetPositionProps,
    WidgetDisplayProps {}
export interface WidgetProps
  extends WidgetDataProps,
    WidgetDynamicPathListProps,
    DataTreeEvaluationProps {
  key?: string
  isDefaultClickDisabled?: boolean
  [key: string]: any
}
