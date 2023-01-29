import { FC } from 'react'

import { StartNode, startNodeMetadata } from '@modou/flow-nodes'

import { FlowCanvas } from '../_/components/FlowCanvas'

const Demo: FC = () => {
  return <FlowCanvas flowNode={StartNode} meta={startNodeMetadata} />
}
export default Demo
