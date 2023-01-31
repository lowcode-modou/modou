import { FC, useMemo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { nodeClasses } from '../styles'
import { FlowNodeProps } from '../types'

export const FlowNodeHandles: FC<
  NodeProps<FlowNodeProps> & {
    filterTargets?: (node: { name: string }) => boolean
    filterSources?: (node: { name: string }) => boolean
  }
> = ({ data, isConnectable, filterTargets, filterSources }) => {
  const targets = useMemo(() => {
    if (!filterTargets) {
      return data.targets
    }
    return data.targets.filter(filterTargets)
  }, [data.targets, filterTargets])
  const sources = useMemo(() => {
    if (!filterSources) {
      return data.sources
    }
    return data.sources.filter(filterSources)
  }, [data.sources, filterSources])
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
