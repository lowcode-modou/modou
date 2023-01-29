import { type FC, memo } from 'react'
import { NodeProps, useReactFlow } from 'reactflow'

import { CodeEditor, CodeEditorModeEnum } from '@modou/code-editor'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { useFlowNodeId } from '../_/hooks'
import { FlowNodeProps } from '../_/types'
import { MRSchemeLoopNodeProps, loopNodeMetadata } from './metadata'

type LoopNodeProps = mr.infer<typeof MRSchemeLoopNodeProps>
const _LoopNode: FC<NodeProps<FlowNodeProps<LoopNodeProps>>> = (props) => {
  const id = useFlowNodeId()
  return (
    <>
      <FlowNodeWrapper meta={loopNodeMetadata} node={props}>
        <div>
          <div>循环体</div>
          <CodeEditor
            mode={CodeEditorModeEnum.Javascript}
            value={props.data.props.iterable}
            onChange={(value) => {
              props.data._onChangeNode({
                id,
                data: {
                  ...props.data,
                  props: {
                    ...props.data.props,
                    iterable: value,
                  },
                },
              })
            }}
          />
        </div>
      </FlowNodeWrapper>
      <FlowNodeHandles {...props} />
    </>
  )
}
export const LoopNode = memo(_LoopNode)
