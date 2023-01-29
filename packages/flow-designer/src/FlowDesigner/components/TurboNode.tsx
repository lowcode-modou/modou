import React, { FC, ReactNode, memo } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

export interface TurboNodeData {
  title: string
  icon?: ReactNode
  subline?: string
}

const _TurboNode: FC<NodeProps<TurboNodeData>> = ({ data }) => {
  return (
    <>
      <div className="wrapper gradient">
        <div className="inner">
          <div className="body">
            {data.icon && <div className="icon">{data.icon}</div>}
            <div>
              <div className="title">{data.title}</div>
              {data.subline && <div className="subline">{data.subline}</div>}
            </div>
          </div>
          <Handle type="target" position={Position.Left} />
          <Handle type="source" position={Position.Right} />
        </div>
      </div>
    </>
  )
}

export const TurboNode = memo(_TurboNode)
