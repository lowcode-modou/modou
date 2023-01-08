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

export const usePageOutlineTree = () => {
  const { canvasDesignerFile } = useCanvasDesignerFile()
  const { appManager } = useAppManager()
  const rootWidget = appManager.widgetMap.get(
    canvasDesignerFile.meta.rootWidgetId,
  )!
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
  > = [{ _type: 'widget', ...rootWidget.meta }]
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
      if (!isEmpty(widgetDef.metadata.slots)) {
        Object.entries(widgetDef.metadata.slots).forEach(([path, slot]) => {
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
      const curSlot = appManager.widgetMap.get(curNode.widgetId)?.meta.slots?.[
        curNode.path
      ]
      if (curSlot && !isEmpty(curSlot)) {
        curSlot.forEach((widgetId: string) => {
          nodeStack.push({
            _type: 'widget',
            ...appManager.widgetMap.get(widgetId)?.meta!,
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
