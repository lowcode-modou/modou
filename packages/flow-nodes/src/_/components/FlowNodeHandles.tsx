import { FC } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { nodeClasses } from '../styles'
import { FlowNodeProps } from '../types'

export const FlowNodeHandles: FC<
  NodeProps<FlowNodeProps> & {
    hiddenTargets?: boolean
    hiddenSources?: boolean
  }
> = ({ data, isConnectable, hiddenTargets, hiddenSources }) => {
  return (
    <>
      {!hiddenTargets &&
        data.targets.map((target) => (
          <Handle
            className={nodeClasses.nodeTargetPort}
            id={target.name}
            key={target.name}
            type="target"
            position={Position.Left}
            isConnectable={isConnectable}
          />
        ))}
      {!hiddenSources &&
        data.sources.map((source) => (
          <Handle
            className={nodeClasses.nodeSourcePort}
            id={source.name}
            key={source.name}
            type="source"
            position={Position.Right}
            isConnectable={isConnectable}
          />
        ))}
    </>
  )
}
