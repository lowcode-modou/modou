import { type FC, memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { cx, mcss } from '@modou/css-in-js'

import { nodeClasses } from '../_/styles'

const _StartNode: FC<NodeProps<any>> = ({ isConnectable }) => {
  return (
    <>
      <div className={cx(nodeClasses.wrapper)}>
        <div className={nodeClasses.wrapperHeader}>Wrapper Header</div>
        <div className={nodeClasses.wrapperBody}>Wrapper Body</div>
      </div>
      <Handle
        className={nodeClasses.nodeSourcePort}
        type="source"
        position={Position.Right}
        id="output"
        isConnectable={isConnectable}
      />
      <Handle
        className={nodeClasses.nodeSourcePort}
        type="source"
        position={Position.Bottom}
        id="output1"
        isConnectable={isConnectable}
      />
      <Handle
        className={nodeClasses.nodeSourcePort}
        type="source"
        position={Position.Bottom}
        id="output2"
        style={{ left: 10 }}
        isConnectable={isConnectable}
      />
    </>
  )
}
export const StartNode = memo(_StartNode)

const classes = {
  wrapper: mcss`
  `,
}
