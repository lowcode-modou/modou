import { DownOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import type RcTree from 'rc-tree'
import React, { ComponentProps, FC, useContext, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'

import { AppFactoryContext } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { useMoveWidget } from '../hooks'
import {
  WidgetTreeNode,
  pageOutlineTreeSelector,
  selectedWidgetIdAtom,
  widgetRelationByWidgetIdSelector,
} from '../store'

enum DropPositionEnum {
  Before = -1,
  Inner = 0,
  After = 1,
}

export const CanvasDesignerOutlineTree: FC = () => {
  const pageOutlineTree = useRecoilValue(pageOutlineTreeSelector)
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

  const allowDrop: ComponentProps<typeof Tree<WidgetTreeNode>>['allowDrop'] = ({
    dropNode,
    dropPosition,
  }) => {
    // console.log('dropNode', dropNode, dropPosition)
    const { widget } = dropNode
    if (!widget) {
      return false
    }
    const widgetMetadata = appFactory.widgetByType[widget.widgetType].metadata

    if (dropPosition === DropPositionEnum.Before) {
      return !!widgetRelationByWidgetId[widget.widgetId].parent
    } else if (dropPosition === DropPositionEnum.Inner) {
      return !!widgetMetadata.slots?.children
    } else if (dropPosition === DropPositionEnum.After) {
      return !!widgetRelationByWidgetId[widget.widgetId].parent
    }
    return false
  }

  const onDrop: ComponentProps<typeof Tree<WidgetTreeNode>>['onDrop'] = (
    info,
  ) => {
    const dropPos = info.node.pos.split('-')
    const dropPosition: DropPositionEnum =
      info.dropPosition - Number(dropPos[dropPos.length - 1])

    const dragWidget = info.dragNode.widget
    const dropWidget = info.node.widget
    if (!dragWidget || !dropWidget) {
      return
    }

    const parent = widgetRelationByWidgetId[dropWidget.widgetId].parent

    // TODO 替换真实的 SLOT NAME
    const parentSlotName = 'children'
    switch (dropPosition) {
      case DropPositionEnum.Before:
        if (parent && parentSlotName) {
          moveWidget({
            sourceWidgetId: dragWidget.widgetId,
            targetWidgetId: parent.props.widgetId,
            targetSlotName: parentSlotName,
            targetPosition: parent.props.slots[parentSlotName].findIndex(
              (widgetId) => dropWidget.widgetId === widgetId,
            ),
          })
        }
        break
      case DropPositionEnum.After:
        if (parent && parentSlotName) {
          moveWidget({
            sourceWidgetId: dragWidget.widgetId,
            targetWidgetId: parent.props.widgetId,
            targetSlotName: parentSlotName,
            targetPosition:
              parent.props.slots[parentSlotName].findIndex(
                (widgetId) => dropWidget.widgetId === widgetId,
              ) + 1,
          })
        }
        break
      case DropPositionEnum.Inner:
        moveWidget({
          sourceWidgetId: dragWidget.widgetId,
          targetWidgetId: dropWidget.widgetId,
          targetSlotName: parentSlotName,
          targetPosition: 0,
        })
        break
      default:
    }
    console.log('dropPosition', dropPosition, info)
  }

  // TODO 支持大纲树和其画布及面板组件互相拖拽 IMPORTANT
  const ref = useRef<RcTree<WidgetTreeNode>>()
  // useEffect(() => {
  //   console.log('tree.ref', ref.current?.state.flattenNodes)
  // })

  return (
    <div className={classes.treeWrapper}>
      <Tree<WidgetTreeNode>
        ref={ref as unknown as any}
        showLine
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
  `,
}
