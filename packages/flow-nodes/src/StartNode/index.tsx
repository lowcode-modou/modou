import { type FC, memo } from 'react'
import { NodeProps } from 'reactflow'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { FlowNodeProps } from '../_/types'
import { startNodeMetadata } from './metadata'

const _StartNode: FC<NodeProps<FlowNodeProps>> = (props) => {
  return (
    <>
      <FlowNodeWrapper meta={startNodeMetadata} node={props} />
      <FlowNodeHandles {...props} />
    </>
  )
}
export const StartNode = memo(_StartNode)

const classes = {}
