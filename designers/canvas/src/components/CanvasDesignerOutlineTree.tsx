import React, { ComponentProps, FC, useContext, useState } from 'react'
import { DownOutlined } from '@ant-design/icons'
import { Tree } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  pageOutlineTreeSelector,
  selectedWidgetIdAtom,
  widgetRelationByWidgetIdSelector,
  WidgetTreeNode
} from '../store'
import { AppFactoryContext } from '@modou/core'
import { useMoveWidget } from '../hooks'
import { match } from 'ts-pattern'

enum DropPositionEnum {
  Before = -1,
  Inner = 0,
  After = 1
}

const x = 3
const y = 2
const z = 1
const defaultData: DataNode[] = []

const generateData = (_level: number, _preKey?: React.Key, _tns?: DataNode[]) => {
  const preKey = _preKey ?? '0'
  const tns = _tns ?? defaultData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)

export const CanvasDesignerOutlineTree: FC = () => {
  const [gData, setGData] = useState(defaultData)
  // const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0'])
  // const onDragEnter: TreeProps['onDragEnter'] = info => {
  //   console.log(info)
  //   // expandedKeys 需要受控时设置
  //   // setExpandedKeys(info.expandedKeys)
  // }

  // start
  const pageOutlineTree = useRecoilValue(pageOutlineTreeSelector)
  const [selectedWidgetId, setSelectedWidgetId] = useRecoilState(selectedWidgetIdAtom)
  const selectedKeys = [selectedWidgetId || pageOutlineTree.key]
  const widgetRelationByWidgetId = useRecoilValue(widgetRelationByWidgetIdSelector)
  const { moveWidget } = useMoveWidget()

  const appFactory = useContext(AppFactoryContext)

  const onSelect: ComponentProps<typeof Tree>['onSelect'] = ([key]) => {
    const widgetId = key === pageOutlineTree.key ? '' : key
    setSelectedWidgetId(widgetId as string)
  }

  const allowDrop: ComponentProps<typeof Tree<WidgetTreeNode>>['allowDrop'] = ({ dropNode, dropPosition }) => {
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

  const onDrop: ComponentProps<typeof Tree<WidgetTreeNode>>['onDrop'] = info => {
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition: DropPositionEnum = info.dropPosition - Number(dropPos[dropPos.length - 1])

    const dragWidget = info.dragNode.widget
    const dropWidget = info.node.widget
    if (!dragWidget || !dropWidget) {
      return
    }

    const parent = widgetRelationByWidgetId[dragWidget.widgetId].parent

    const parentSlotName = 'children'
    switch (dropPosition) {
      case DropPositionEnum.Before:
        if (parent && parentSlotName) {
          moveWidget({
            sourceWidgetId: dragWidget.widgetId,
            targetWidgetId: parent.props.widgetId,
            targetSlotName: parentSlotName,
            targetPosition: parent.props.slots[parentSlotName].findIndex(widgetId => dropWidget.widgetId === widgetId)
          })
        }
        break
      case DropPositionEnum.After:
        if (parent && parentSlotName) {
          moveWidget({
            sourceWidgetId: dragWidget.widgetId,
            targetWidgetId: parent.props.widgetId,
            targetSlotName: parentSlotName,
            targetPosition: parent.props.slots[parentSlotName]
              .findIndex(widgetId => dropWidget.widgetId === widgetId) + 1
          })
        }
        break
      case DropPositionEnum.Inner:
        moveWidget({
          sourceWidgetId: dragWidget.widgetId,
          targetWidgetId: dropWidget.widgetId,
          targetSlotName: parentSlotName,
          targetPosition: dropWidget.slots[parentSlotName].length
        })
        break
      default:
    }

    console.log(dropPosition, info)
  }

  return <div style={{ padding: '16px 8px' }}>
    <Tree<WidgetTreeNode>
      showLine
      allowDrop={allowDrop}
      switcherIcon={<DownOutlined />}
      selectedKeys={selectedKeys}
      onSelect={onSelect}
      // defaultExpandedKeys={expandedKeys}
      defaultExpandAll
      draggable={{
        icon: false
      }}
      blockNode
      // onDragEnter={onDragEnter}
      onDrop={onDrop}
      treeData={[pageOutlineTree]}
    />
  </div>
}
