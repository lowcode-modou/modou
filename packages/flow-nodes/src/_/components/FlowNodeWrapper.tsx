import { Input } from 'antd'
import { FC, ReactNode, useState } from 'react'
import { NodeProps } from 'reactflow'

import { type FlowNodeMetadata } from '@modou/core'
import { cx, mcss } from '@modou/css-in-js'
import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { runInAction } from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'

enum NameMode {
  Edit,
  Readonly,
}
const UOFlowNodeWrapper: FC<{
  children?: ReactNode
  meta: FlowNodeMetadata<any>
  node: NodeProps<FlowNodeFile<any>>
}> = ({ children, meta, node }) => {
  const [nameMode, setNameMode] = useState<NameMode>(NameMode.Readonly)
  return (
    <div className={cx(classes.wrapper)}>
      <div
        className={cx(classes.header, {
          'all-border-radius': !children,
        })}
      >
        <div className={classes.headerLeft}>
          {meta.icon}
          <div className={classes.nameWrapper}>
            {nameMode === NameMode.Readonly && (
              <span
                className={classes.readOnlyName}
                onClick={() => setNameMode(NameMode.Edit)}
              >
                {node.data.meta.name}
              </span>
            )}
            {nameMode === NameMode.Edit && (
              <Input
                autoFocus
                size={'small'}
                value={node.data.meta.name}
                onBlur={() => setNameMode(NameMode.Readonly)}
                // TODO 失去焦点的时候保存
                onChange={(e) => {
                  runInAction(() => {
                    node.data.meta.name = e.target.value
                  })
                }}
              />
            )}
          </div>
        </div>
        <span>{meta.name}</span>
      </div>
      {children && <div className={classes.body}>{children}</div>}
    </div>
  )
}

export const FlowNodeWrapper = observer(UOFlowNodeWrapper)

const classes = {
  wrapper: mcss`
    border: 1px solid #1677ff;
    border-radius: 8px;
    //height: 40px;
    width: 360px;
    //overflow: hidden;
    font-size: 14px;
    box-sizing: border-box;
  `,
  header: mcss`
    background-color: #888888;
    height: 34px;
    display: flex;
    align-items: center;
    padding: 0 8px;
    color: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    &.all-border-radius{
      border-radius: 8px;
    }
  `,
  headerLeft: mcss`
    display: flex;
    align-items: center;
    border-right: 1px solid white;
    margin-right: 4px;
  `,
  nameWrapper: mcss`
    padding: 0 4px;
  `,
  readOnlyName: mcss`
    &:hover{
      border-bottom: 1px dashed white;
    }
  `,
  body: mcss`
    background-color: white;
    padding: 8px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  `,
}
