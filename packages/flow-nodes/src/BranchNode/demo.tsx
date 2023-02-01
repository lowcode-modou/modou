import { FC } from 'react'

import {
  BranchNode,
  MRSchemeBranchNodeProps,
  branchNodeNodeMetadata,
} from '@modou/flow-nodes'
import { mr } from '@modou/refine'

import { FlowCanvas } from '../_/components/FlowCanvas'
import { FlowNodeProps } from '../_/types'
import { branchNodeInterpreter } from './interpreter'

const Demo: FC = () => {
  return (
    <FlowCanvas
      flowNode={BranchNode}
      meta={branchNodeNodeMetadata}
      runInterpreter={(
        props: FlowNodeProps<mr.infer<typeof MRSchemeBranchNodeProps>>,
      ) => {
        console.log(branchNodeInterpreter(props))
      }}
    />
  )
}
export default Demo
