import { type FC, memo } from 'react'
import { NodeProps } from 'reactflow'

import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { observer } from '@modou/reactivity-react'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { startNodeMetadata } from './metadata'

const _StartNode: FC<NodeProps<FlowNodeFile>> = (props) => {
  return (
    <>
      <FlowNodeWrapper meta={startNodeMetadata} node={props} />
      <FlowNodeHandles {...props} />
    </>
  )
}
export const StartNode = memo(observer(_StartNode))

const classes = {}
