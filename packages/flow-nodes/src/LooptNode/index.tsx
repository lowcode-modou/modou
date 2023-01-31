import { type FC, memo, useMemo } from 'react'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'

import { CodeEditor, CodeEditorModeEnum } from '@modou/code-editor'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { useFlowNodeId } from '../_/hooks'
import { nodeClasses } from '../_/styles'
import { FlowNodeProps, ScopedFlowNodePortNameEnum } from '../_/types'
import { MRSchemeLoopNodeProps, loopNodeMetadata } from './metadata'

type LoopNodeProps = mr.infer<typeof MRSchemeLoopNodeProps>
const _LoopNode: FC<NodeProps<FlowNodeProps<LoopNodeProps>>> = (props) => {
  const id = useFlowNodeId()
  const loopBodyPort = useMemo(() => {
    return props.data.sources.find(
      (s) => s.name === ScopedFlowNodePortNameEnum.LOOP_BODY,
    )!
  }, [props.data.sources])
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
      <FlowNodeHandles
        {...props}
        filterSources={(port) =>
          port.name !== ScopedFlowNodePortNameEnum.LOOP_BODY
        }
      />
      <Handle
        className={nodeClasses.nodeSourcePort}
        id={loopBodyPort.name}
        key={loopBodyPort.name}
        type="source"
        position={Position.Bottom}
        isConnectable={props.isConnectable}
      />
    </>
  )
}
export const LoopNode = memo(_LoopNode)
