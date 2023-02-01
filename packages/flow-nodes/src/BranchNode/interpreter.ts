import { evalScript } from '@modou/evaluate'
import { MRSchemeBranchNodeProps } from '@modou/flow-nodes'
import { mr } from '@modou/refine'

import { FlowNodeInterpreter } from '../_/types'

export const branchNodeInterpreter: FlowNodeInterpreter<
  mr.infer<typeof MRSchemeBranchNodeProps>
> = (props) => {
  // 1、迭代条件
  // 2、找到为真的条件
  // 3、找到为真的条件对应的 source port
  // 4、找到 source port 对应的 target node
  // 5、执行target node
  // 返回
  const branches = props.props.branches
  for (const branch of branches) {
    if (evalScript(`return ${branch.script}`, {})) {
      return
    }
  }
}
