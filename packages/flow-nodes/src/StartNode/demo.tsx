import { FC } from 'react'

import { StartNode } from '@modou/flow-nodes'

import { FlowCanvas } from '../_/components/FlowCanvas'

const Demo: FC = () => {
  return <FlowCanvas flowNode={StartNode} />
}
export default Demo
