import { head, isEmpty } from 'lodash'
import { DataNode } from 'rc-tree/es/interface'
import { useContext } from 'react'

import {
  AppFactoryContext,
  WidgetBaseProps,
  WidgetSlot,
  useAppManager,
} from '@modou/core'
import { PageFile } from '@modou/meta-vfs'
import { toJS } from '@modou/reactivity'

import { useCanvasDesignerFile } from '../contexts/CanvasDesignerFileContext'

export interface OutlineTreeNodeWidget {
  widget: WidgetBaseProps
  nodeType: 'widget'
}
export interface OutlineTreeNodeSlot {
  slot: WidgetSlot & { path: string; widgetId: string }
  nodeType: 'slot'
}
export interface OutlineTreeNodePage {
  file: PageFile
  nodeType: 'root'
}

export type OutlineTreeNode = DataNode & {
  children: OutlineTreeNode[]
} & (OutlineTreeNodeWidget | OutlineTreeNodeSlot | OutlineTreeNodePage)

// TODO 大纲树放在文件层生成
export const usePageOutlineTree = () => {
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const { appManager } = useAppManager()
  const rootWidget = appManager.widgetMap[canvasDesignerFile.meta.rootWidgetId]
  const appFactory = useContext(AppFactoryContext)
  const parentTreeNodes: OutlineTreeNode[] = [
    {
      key: canvasDesignerFile.meta.id,
      title: canvasDesignerFile.meta.name,
      file: canvasDesignerFile,
      nodeType: 'root',
      children: [],
    },
  ]
  const rootTreeNode = head(parentTreeNodes)
  const nodeStack: Array<
    | ({ _type: 'widget' } & WidgetBaseProps)
    | ({ _type: 'slot'; path: string; widgetId: string } & WidgetSlot)
  > = [{ _type: 'widget', ...toJS(rootWidget.meta) }]
  while (nodeStack.length !== 0) {
    const curNode = nodeStack.pop()!
    if (curNode._type === 'widget') {
      const curTreeNode: OutlineTreeNode = {
        nodeType: 'widget',
        key: curNode?.id ?? '',
        title: curNode?.name ?? '',
        widget: curNode,
        children: [],
      }
      const parentTreeNode = parentTreeNodes.pop()
      parentTreeNode?.children.unshift(curTreeNode)
      const widgetDef = appFactory.widgetByType[curNode.type]
      const allSlots = {
        ...widgetDef.metadata.slots,
        ...(curNode.dynamicSlots as unknown as Record<string, WidgetSlot>),
      }
      if (!isEmpty(allSlots)) {
        Object.entries(allSlots).forEach(([path, slot]) => {
          nodeStack.push({ _type: 'slot', path, widgetId: curNode.id, ...slot })
          parentTreeNodes.push(curTreeNode)
        })
      }
    } else if (curNode._type === 'slot') {
      const curTreeNode: OutlineTreeNode = {
        nodeType: 'slot',
        key: `${curNode.widgetId}_${curNode?.path}` ?? '',
        title: curNode?.name ?? '',
        slot: curNode,
        children: [],
        selectable: false,
        className: 'outline-node-slot',
        // switcherIcon: <ClusterOutlined />,
      }
      const parentTreeNode = parentTreeNodes.pop()
      parentTreeNode?.children.unshift(curTreeNode)
      const curSlot =
        appManager.widgetMap[curNode.widgetId]?.slots?.[curNode.path]
      if (curSlot && !isEmpty(curSlot)) {
        curSlot.forEach((widgetId: string) => {
          nodeStack.push({
            _type: 'widget',
            ...toJS(appManager.widgetMap[widgetId]?.meta),
          })
          parentTreeNodes.push(curTreeNode)
        })
      }
    }
  }
  return {
    treeData: rootTreeNode as OutlineTreeNode,
  }
}
