import { FC } from 'react'

import { BranchNode, branchNodeNodeMetadata } from '@modou/flow-nodes'

import { FlowCanvas } from '../_/components/FlowCanvas'

const Demo: FC = () => {
  return <FlowCanvas flowNode={BranchNode} meta={branchNodeNodeMetadata} />
}
export default Demo
