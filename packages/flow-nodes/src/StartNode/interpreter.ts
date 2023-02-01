import { FlowNodeInterpreter } from '@modou/core'
import { MRSchemeStartNodeProps } from '@modou/flow-nodes'
import { mr } from '@modou/refine'

export const startNodeInterpreter: FlowNodeInterpreter<
  mr.infer<typeof MRSchemeStartNodeProps>
> = (props) => {
  // 直接执行下一步流程
}
