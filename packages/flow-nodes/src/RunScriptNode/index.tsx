import produce from 'immer'
import { type FC, memo } from 'react'
import { NodeProps } from 'reactflow'

import { CodeEditor, CodeEditorModeEnum } from '@modou/code-editor'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { useFlowNodeId } from '../_/hooks'
import { FlowNodeProps } from '../_/types'
import { MRSchemeRunScriptNodeProps, runScriptNodeMetadata } from './metadata'

const _RunScriptNode: FC<
  NodeProps<FlowNodeProps<mr.infer<typeof MRSchemeRunScriptNodeProps>>>
> = (props) => {
  const id = useFlowNodeId()
  console.log('_RunScriptNode')

  return (
    <>
      <FlowNodeWrapper meta={runScriptNodeMetadata} node={props}>
        <CodeEditor
          mode={CodeEditorModeEnum.Javascript}
          value={props.data.props.script}
          onChange={(value) => {
            props.data._onChangeNode({
              id,
              data: produce(props.data, (draft) => {
                draft.props.script = value
              }),
            })
          }}
        />
      </FlowNodeWrapper>
      <FlowNodeHandles {...props} />
    </>
  )
}
export const RunScriptNode = memo(_RunScriptNode)
