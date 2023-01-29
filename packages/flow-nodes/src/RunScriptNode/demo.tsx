import { FC } from 'react'

import { RunScriptNode, runScriptNodeNodeMetadata } from '@modou/flow-nodes'

import { FlowCanvas } from '../_/components/FlowCanvas'

const Demo: FC = () => {
  return (
    <FlowCanvas flowNode={RunScriptNode} meta={runScriptNodeNodeMetadata} />
  )
}
export default Demo
