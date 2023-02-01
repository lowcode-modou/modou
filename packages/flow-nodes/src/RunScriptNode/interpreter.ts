import { FlowNodeInterpreter } from '@modou/core'
import { evalScript } from '@modou/evaluate'
import { MRSchemeRunScriptNodeProps } from '@modou/flow-nodes'
import { mr } from '@modou/refine'

export const runScriptNodeInterpreter: FlowNodeInterpreter<
  mr.infer<typeof MRSchemeRunScriptNodeProps>
> = (props) => {
  const script = props.props.script
  return evalScript(script, {})
}
