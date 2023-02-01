import { FC } from 'react'

import {
  MRSchemeRunScriptNodeProps,
  RunScriptNode,
  runScriptNodeMetadata,
} from '@modou/flow-nodes'
import { mr } from '@modou/refine'

import { FlowCanvas } from '../_/components/FlowCanvas'
import { FlowNodeProps } from '../_/types'
import { runScriptNodeInterpreter } from './interpreter'

const Demo: FC = () => {
  return (
    <>
      <FlowCanvas
        flowNode={RunScriptNode}
        meta={runScriptNodeMetadata}
        runInterpreter={(
          props: FlowNodeProps<mr.infer<typeof MRSchemeRunScriptNodeProps>>,
        ) => {
          console.log(runScriptNodeInterpreter(props))
        }}
      />
    </>
  )
}
export default Demo
