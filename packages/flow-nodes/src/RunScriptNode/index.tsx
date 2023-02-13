import { type FC } from 'react'
import { NodeProps } from 'reactflow'

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
import { MRSchemeRunScriptNodeProps, runScriptNodeMetadata } from './metadata'

const _RunScriptNode: FC<
  NodeProps<
    FlowNodeFile<FlowNodeFileMeta<mr.infer<typeof MRSchemeRunScriptNodeProps>>>
  >
> = (props) => {
  console.log('_RunScriptNode')

  return (
    <>
      <FlowNodeWrapper meta={runScriptNodeMetadata} node={props}>
        <CodeEditor
          mode={CodeEditorModeEnum.Javascript}
          value={props.data.meta.props.script}
          onChange={(value) => {
            runInAction(() => {
              props.data.meta.props.script = value
            })
          }}
        />
      </FlowNodeWrapper>
      <FlowNodeHandles
        targets={props.data.meta.targets}
        sources={props.data.meta.sources}
        isConnectable={props.isConnectable}
      />
    </>
  )
}
export const RunScriptNode = observer(_RunScriptNode)
