import { type FC } from 'react'
import { NodeProps } from 'reactflow'

import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { observer } from '@modou/reactivity-react'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { startNodeMetadata } from './metadata'

const UOStartNode: FC<NodeProps<FlowNodeFile>> = (props) => {
  return (
    <>
      <FlowNodeWrapper meta={startNodeMetadata} node={props} />
      <FlowNodeHandles
        sources={props.data.meta.sources}
        targets={props.data.meta.targets}
        isConnectable={props.isConnectable}
      />
    </>
  )
}
export const StartNode = observer(UOStartNode)

// const classes = {}
