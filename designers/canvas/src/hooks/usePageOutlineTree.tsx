import { ClusterOutlined } from '@ant-design/icons'
import { head, isEmpty } from 'lodash'
import { DataNode } from 'rc-tree/es/interface'
import { useContext } from 'react'
import { useRecoilValue } from 'recoil'

import {
  AppFactoryContext,
  Page,
  WidgetBaseProps,
  WidgetSlot,
} from '@modou/core'

import { pageSelector, widgetByIdSelector } from '../store'

export interface OutlineTreeNodeWidget {
  widget?: WidgetBaseProps
  nodeType: 'widget'
}
export interface OutlineTreeNodeSlot {
  slot?: WidgetSlot & { path: string }
  nodeType: 'slot'
}
export interface OutlineTreeNodePage {
  page?: Page
  nodeType: 'page'
}

export type OutlineTreeNode = DataNode & {
  children: OutlineTreeNode[]
} & (OutlineTreeNodeWidget | OutlineTreeNodeSlot | OutlineTreeNodePage)

export const usePageOutlineTree = () => {
  const page = useRecoilValue(pageSelector)
  const widgetById = useRecoilValue(widgetByIdSelector)
  const rootWidget = widgetById[page.rootWidgetId]
  const appFactory = useContext(AppFactoryContext)

  const parentTreeNodes: OutlineTreeNode[] = [
    {
      key: page.id,
      title: page.name,
      page,
      nodeType: 'page',
      children: [],
    },
  ]
  const rootTreeNode = head(parentTreeNodes)
  const nodeStack: Array<
    | ({ _type: 'widget' } & WidgetBaseProps)
    | ({ _type: 'slot'; path: string; widgetId: string } & WidgetSlot)
  > = [{ _type: 'widget', ...rootWidget }]
  while (nodeStack.length !== 0) {
    const curNode = nodeStack.pop()!
    if (curNode._type === 'widget') {
      const curTreeNode: OutlineTreeNode = {
        nodeType: 'widget',
        key: curNode?.id ?? '',
        title: curNode?.widgetName ?? '',
        widget: curNode,
        children: [],
      }
      const parentTreeNode = parentTreeNodes.pop()
      parentTreeNode?.children.unshift(curTreeNode)
      const widgetDef = appFactory.widgetByType[curNode.widgetType]
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
        switcherIcon: <ClusterOutlined />,
      }
      const parentTreeNode = parentTreeNodes.pop()
      parentTreeNode?.children.unshift(curTreeNode)
      const curSlot = widgetById[curNode.widgetId]?.slots?.[curNode.path]
      if (!isEmpty(curSlot)) {
        curSlot.forEach((widgetId: string) => {
          nodeStack.push({ _type: 'widget', ...widgetById[widgetId] })
          parentTreeNodes.push(curTreeNode)
        })
      }
    }
  }
  return {
    treeData: rootTreeNode as OutlineTreeNode,
  }
}
