import { FC } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { observer } from '@modou/reactivity-react'

import { nodeClasses } from '../styles'

const UOFlowNodeHandles: FC<
  NodeProps<FlowNodeFile> & {
    filterTargets?: (node: { name: string }) => boolean
    filterSources?: (node: { name: string }) => boolean
  }
> = ({ data, isConnectable, filterTargets, filterSources }) => {
  const targets = filterTargets
    ? data.meta.targets.filter(filterTargets)
    : data.meta.targets
  const sources = filterSources
    ? data.meta.sources.filter(filterSources)
    : data.meta.sources
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
