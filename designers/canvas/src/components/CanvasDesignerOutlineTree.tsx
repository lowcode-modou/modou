import { DownOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import type RcTree from 'rc-tree'
import React, { ComponentProps, FC, useContext, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { AppFactoryContext } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { useMoveWidget } from '../hooks'
import {
  OutlineTreeNode,
  OutlineTreeNodeWidget,
  usePageOutlineTree,
} from '../hooks/usePageOutlineTree'
import {
  selectedWidgetIdAtom,
  widgetRelationByWidgetIdSelector,
} from '../store'

enum DropPositionEnum {
  Before = -1,
  Inner = 0,
  After = 1,
}

export const CanvasDesignerOutlineTree: FC = () => {
  const { treeData: pageOutlineTree } = usePageOutlineTree()
  const [selectedWidgetId, setSelectedWidgetId] =
    useRecoilState(selectedWidgetIdAtom)
  const selectedKeys = [selectedWidgetId || pageOutlineTree.key]
  const widgetRelationByWidgetId = useRecoilValue(
    widgetRelationByWidgetIdSelector,
  )
  const { moveWidget } = useMoveWidget()

  const appFactory = useContext(AppFactoryContext)

  const onSelect: ComponentProps<typeof Tree>['onSelect'] = ([key]) => {
    const widgetId = key === pageOutlineTree.key ? '' : key
    setSelectedWidgetId(widgetId as string)
  }

  const allowDrop: ComponentProps<
    typeof Tree<OutlineTreeNode>
  >['allowDrop'] = ({ dropNode, dropPosition, dragNode }) => {
    // console.log('dropNode', dropNode, dropPosition)
    const { widget } = dropNode as unknown as OutlineTreeNodeWidget
    if (!widget) {
      return false
    }
    const widgetMetadata = appFactory.widgetByType[widget.widgetType].metadata

    if (dropPosition === DropPositionEnum.Before) {
      return !!widgetRelationByWidgetId[widget.id].parent
    } else if (dropPosition === DropPositionEnum.Inner) {
      return !!widgetMetadata.slots?.children
    } else if (dropPosition === DropPositionEnum.After) {
      return !!widgetRelationByWidgetId[widget.id].parent
    }
    return false
  }

  const onDrop: ComponentProps<typeof Tree<OutlineTreeNode>>['onDrop'] = (
    info,
  ) => {
    const dropPos = info.node.pos.split('-')
    const dropPosition: DropPositionEnum =
      info.dropPosition - Number(dropPos[dropPos.length - 1])

    const dragWidget = (info.dragNode as unknown as OutlineTreeNodeWidget)
      .widget
    const dropWidget = (info.node as unknown as OutlineTreeNodeWidget).widget
    if (!dragWidget || !dropWidget) {
      return
    }

    const parent = widgetRelationByWidgetId[dropWidget.id].parent

    // TODO 替换真实的 SLOT NAME
    const parentSlotName = 'children'
    switch (dropPosition) {
      case DropPositionEnum.Before:
        if (parent && parentSlotName) {
          moveWidget({
            sourceWidgetId: dragWidget.id,
            targetWidgetId: parent.props.id,
            targetSlotName: parentSlotName,
            targetPosition: parent.props.slots[parentSlotName].findIndex(
              (widgetId) => dropWidget.id === widgetId,
            ),
          })
        }
        break
      case DropPositionEnum.After:
        if (parent && parentSlotName) {
          moveWidget({
            sourceWidgetId: dragWidget.id,
            targetWidgetId: parent.props.id,
            targetSlotName: parentSlotName,
            targetPosition:
              parent.props.slots[parentSlotName].findIndex(
                (widgetId) => dropWidget.id === widgetId,
              ) + 1,
          })
        }
        break
      case DropPositionEnum.Inner:
        moveWidget({
          sourceWidgetId: dragWidget.id,
          targetWidgetId: dropWidget.id,
          targetSlotName: parentSlotName,
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
      <Tree.DirectoryTree<OutlineTreeNode>
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
        }}
        blockNode
        // onDragEnter={onDragEnter}
        onDrop={onDrop}
        treeData={[pageOutlineTree]}
      />
    </div>
  )
}

const classes = {
  treeWrapper: mcss`
    padding: 16px 8px;
    .ant-tree-indent-unit{
      width: 5px;
    }
    .outline-node-slot{
      color: grey;
      .ant-tree-title{
        cursor: not-allowed;
      }
    }
  `,
}
