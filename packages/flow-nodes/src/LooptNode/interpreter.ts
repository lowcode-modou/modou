import { FlowNodeInterpreter } from '@modou/core'
import { evalScript } from '@modou/evaluate'
import { MRSchemeLoopNodeProps } from '@modou/flow-nodes'
import { mr } from '@modou/refine'

export const loopNodeInterpreter: FlowNodeInterpreter<
  mr.infer<typeof MRSchemeLoopNodeProps>
> = async (props) => {
  const iterable = props.props.iterable
  const res = await Promise.all(
    evalScript(`return ${iterable}`, {}).map((item: any) => {
      console.log('item', item)
      return 'TODO'
    }),
  )
  return res
}
