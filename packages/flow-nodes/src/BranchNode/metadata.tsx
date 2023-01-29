import { AndroidOutlined } from '@ant-design/icons'

import { FlowNodeMetadata, FlowNodePortNameEnum } from '@modou/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mr } from '@modou/refine'

import { FlowNodeEnum } from '../_/types'

export const MRSchemeBranchNodeProps = FlowNodeMetadata.createMRFlowNodeProps({
  type: FlowNodeEnum.BRANCH_NODE,
  name: '条件分支',
  props: {
    branches: {
      def: mr
        .array(
          mr.object({
            script: mr.string().default(''),
            port: mr.string(),
          }),
        )
        .default([
          {
            script: '',
            port: FlowNodePortNameEnum.SOURCE,
          },
        ]),
    },
  },
})

export const branchNodeNodeMetadata = FlowNodeMetadata.createMetadata({
  version: '0.0.1',
  type: FlowNodeEnum.BRANCH_NODE,
  name: '条件分支',
  icon: <AndroidOutlined />,
  mrPropsScheme: MRSchemeBranchNodeProps,
})
