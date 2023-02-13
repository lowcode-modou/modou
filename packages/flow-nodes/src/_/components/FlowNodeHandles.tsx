import { FC } from 'react'
import { Handle, Position } from 'reactflow'

import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { observer } from '@modou/reactivity-react'

import { nodeClasses } from '../styles'

type Targets = FlowNodeFile['meta']['targets']
type Sources = FlowNodeFile['meta']['sources']
const UOFlowNodeHandles: FC<{
  targets: Targets
  sources: Sources
  isConnectable: boolean
}> = ({ targets, sources, isConnectable }) => {
  return (
    <>
      {targets.map((target) => (
        <Handle
          className={nodeClasses.nodeTargetPort}
          id={target.name}
          key={target.name}
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      ))}
      {sources.map((source) => (
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

export const FlowNodeHandles = observer(UOFlowNodeHandles)
