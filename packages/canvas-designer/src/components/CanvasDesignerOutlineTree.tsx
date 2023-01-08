import { DownOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import { head } from 'lodash'
import { toJS } from 'mobx'
import { observer } from 'mobx-react-lite'
import type RcTree from 'rc-tree'
import React, { ComponentProps, FC, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { match } from 'ts-pattern'

import { WidgetBaseProps } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { useMoveWidget } from '../hooks'
import {
  OutlineTreeNode,
  OutlineTreeNodeSlot,
  OutlineTreeNodeWidget,
  usePageOutlineTree,
} from '../hooks/usePageOutlineTree'
import {
  selectedWidgetIdAtom,
  widgetByIdSelector,
  widgetRelationByWidgetIdSelector,
} from '../store'

enum DropPositionEnum {
  Before = -1,
  Inner = 0,
  After = 1,
}

const _CanvasDesignerOutlineTree: FC = () => {
  const { treeData: pageOutlineTree } = usePageOutlineTree()
  const [selectedWidgetId, setSelectedWidgetId] =
    useRecoilState(selectedWidgetIdAtom)
  const selectedKeys = [selectedWidgetId || pageOutlineTree.key]
  const widgetRelationByWidgetId = useRecoilValue(
    widgetRelationByWidgetIdSelector,
  )
  const widgetById = useRecoilValue(widgetByIdSelector)
  const { moveWidget } = useMoveWidget()

  // const appFactory = useContext(AppFactoryContext)

  const onSelect: ComponentProps<typeof Tree>['onSelect'] = ([key]) => {
    const widgetId = key === pageOutlineTree.key ? '' : key
    setSelectedWidgetId(widgetId as string)
  }

  const allowDrop: ComponentProps<
    typeof Tree<OutlineTreeNode>
  >['allowDrop'] = ({ dropNode, dropPosition, dragNode }) => {
    if (dragNode.nodeType === 'slot' || dragNode.nodeType === 'root') {
      return false
    }
    if (dropNode.nodeType === 'root') {
      return false
    }

    if (dropNode.nodeType === 'slot') {
      return dropPosition === DropPositionEnum.Inner
    }
    if (dropNode.nodeType === 'widget') {
      return dropPosition !== DropPositionEnum.Inner
    }

    return false
  }

  const onDrop: ComponentProps<typeof Tree<OutlineTreeNode>>['onDrop'] = ({
    dragNode,
    node: dropNode,
    node: { pos },
    dropPosition: _dropPosition,
  }) => {
    const dropPos = pos.split('-')
    const dropPosition: DropPositionEnum =
      _dropPosition - Number(dropPos[dropPos.length - 1])

    const dragWidget = (dragNode as unknown as OutlineTreeNodeWidget).widget
    if (dropNode.nodeType !== 'slot' && dropNode.nodeType !== 'widget') {
      return
    }
    const [parentWidget, parentSlotPath] = match<
      typeof dropNode.nodeType,
      [WidgetBaseProps, string]
    >(dropNode.nodeType)
      .with('slot', () => [
        widgetById[(dropNode as unknown as OutlineTreeNodeSlot).slot.widgetId],
        (dropNode as unknown as OutlineTreeNodeSlot).slot.path,
      ])
      .with('widget', () => [
        widgetRelationByWidgetId[
          (dropNode as unknown as OutlineTreeNodeWidget).widget.id
        ].parent!.props,
        widgetRelationByWidgetId[
          (dropNode as unknown as OutlineTreeNodeWidget).widget.id
        ].slotPath,
      ])
      .exhaustive()
    switch (dropPosition) {
      case DropPositionEnum.Before:
        if (parentWidget && parentSlotPath) {
          moveWidget({
            sourceWidgetId: dragWidget.id,
            targetWidgetId: parentWidget.id,
            targetSlotPath: parentSlotPath,
            targetPosition: parentWidget.slots[parentSlotPath].findIndex(
              (widgetId) =>
                (dropNode as OutlineTreeNodeWidget).widget.id === widgetId,
            ),
          })
        }
        break
      case DropPositionEnum.After:
        if (parentWidget && parentSlotPath) {
          moveWidget({
            sourceWidgetId: dragWidget.id,
            targetWidgetId: parentWidget.id,
            targetSlotPath: parentSlotPath,
            targetPosition:
              parentWidget.slots[parentSlotPath].findIndex(
                (widgetId) =>
                  (dropNode as OutlineTreeNodeWidget).widget.id === widgetId,
              ) + 1,
          })
        }
        break
      case DropPositionEnum.Inner:
        moveWidget({
          sourceWidgetId: dragWidget.id,
          targetWidgetId: parentWidget.id,
          targetSlotPath: parentSlotPath,
          targetPosition: 0,
        })
        break
      default:
    }
  }

  // TODO 支持大纲树和其画布及面板组件互相拖拽 IMPORTANT
  const ref = useRef<RcTree<OutlineTreeNode>>()
  // useEffect(() => {
  //   console.log('tree.ref', ref.current?.state.flattenNodes)
  // })

  // FIXME 跨层架拖拽
  return (
    <div className={classes.treeWrapper}>
      <Tree<OutlineTreeNode>
        ref={ref as unknown as any}
        multiple={false}
        icon={false}
        // showLine
        allowDrop={allowDrop}
        switcherIcon={<DownOutlined />}
        selectedKeys={selectedKeys}
        onSelect={onSelect}
        // defaultExpandedKeys={expandedKeys}
        defaultExpandAll
        draggable={{
          icon: false,
          nodeDraggable: (node) =>
            (node as unknown as OutlineTreeNode).nodeType === 'widget' &&
            (node as unknown as OutlineTreeNodeWidget).widget.id !==
              (
                head(
                  pageOutlineTree.children || [],
                ) as unknown as OutlineTreeNodeWidget
              )?.widget?.id,
        }}
        blockNode
        // onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={[toJS(pageOutlineTree)]}
      />
    </div>
  )
}
export const CanvasDesignerOutlineTree = observer(_CanvasDesignerOutlineTree)

const classes = {
  treeWrapper: mcss`
    padding: 8px 4px;
    .ant-tree{
      line-height: 20px!important;
      &-indent-unit{
				width: 5px;
			}
      &-node-content-wrapper{
				line-height: 20px!important;
				min-height: 20px!important;
			}
      &-title{
				cursor: not-allowed;
				font-size: 12px!important;
			}
      &-switcher{
				height: 20px;
        width: 20px;
			}
    }
    .outline-node-slot{
      color: rgba(22,119,255,.7);
      .ant-tree-title{
        cursor: not-allowed;
      }
    }
  `,
}
