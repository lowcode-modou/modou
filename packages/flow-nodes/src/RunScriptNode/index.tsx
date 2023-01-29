import { type FC, memo } from 'react'
import { NodeProps } from 'reactflow'

import { CodeEditor, CodeEditorModeEnum } from '@modou/code-editor'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { useFlowNodeId } from '../_/hooks'
import { FlowNodeProps } from '../_/types'
import {
  MRSchemeRunScriptNodeProps,
  runScriptNodeNodeMetadata,
} from './metadata'

const _RunScriptNode: FC<
  NodeProps<FlowNodeProps<mr.infer<typeof MRSchemeRunScriptNodeProps>>>
> = (props) => {
  const id = useFlowNodeId()
  console.log('_RunScriptNode')

  return (
    <>
      <FlowNodeWrapper meta={runScriptNodeNodeMetadata} node={props}>
        <CodeEditor
          mode={CodeEditorModeEnum.Javascript}
          value={props.data.props.script}
          onChange={(value) => {
            props.data._onChangeNode({
              id,
              data: {
                ...props.data,
                props: {
                  ...props.data.props,
                  props: {
                    ...props.data.props,
                    script: value,
                  },
                },
              },
            })
          }}
        />
      </FlowNodeWrapper>
      <FlowNodeHandles {...props} />
    </>
  )
}
export const RunScriptNode = memo(_RunScriptNode)
