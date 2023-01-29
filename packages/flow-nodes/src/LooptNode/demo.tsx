import { FC } from 'react'

import { LoopNode, loopNodeMetadata } from '@modou/flow-nodes'

import { FlowCanvas } from '../_/components/FlowCanvas'

const Demo: FC = () => {
  return <FlowCanvas flowNode={LoopNode} meta={loopNodeMetadata} />
}
export default Demo
