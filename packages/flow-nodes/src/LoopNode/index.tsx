import { type FC } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { CodeEditor, CodeEditorModeEnum } from '@modou/code-editor'
import {
  FlowNodeFile,
  FlowNodeFileMeta,
} from '@modou/meta-vfs/src/FlowNodeFile'
import { runInAction } from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'
import { mr } from '@modou/refine'

import { FlowNodeHandles } from '../_/components/FlowNodeHandles'
import { FlowNodeWrapper } from '../_/components/FlowNodeWrapper'
import { nodeClasses } from '../_/styles'
import { ScopedFlowNodePortNameEnum } from '../_/types'
import { MRSchemeLoopNodeProps, loopNodeMetadata } from './metadata'

const _LoopNode: FC<
  NodeProps<
    FlowNodeFile<FlowNodeFileMeta<mr.infer<typeof MRSchemeLoopNodeProps>>>
  >
> = (props) => {
  const loopBodyPort = props.data.meta.sources.find(
    (s) => s.name === ScopedFlowNodePortNameEnum.LOOP_BODY,
  )!
  return (
    <>
      <FlowNodeWrapper meta={loopNodeMetadata} node={props}>
        <div>
          <div>循环体</div>
          <CodeEditor
            mode={CodeEditorModeEnum.Javascript}
            value={props.data.meta.props.iterable}
            onChange={(value) => {
              runInAction(() => {
                props.data.meta.props.iterable = value
              })
            }}
          />
        </div>
      </FlowNodeWrapper>
      <FlowNodeHandles
        sources={props.data.meta.sources.filter(
          (port) => port.name !== ScopedFlowNodePortNameEnum.LOOP_BODY,
        )}
        targets={props.data.meta.targets}
        isConnectable={props.isConnectable}
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
export const LoopNode = observer(_LoopNode)
