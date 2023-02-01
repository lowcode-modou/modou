import { AndroidOutlined } from '@ant-design/icons'

import { FlowNodeMetadata } from '@modou/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mr } from '@modou/refine'

import { FlowNodeEnum } from '../_/types'

export const MRSchemeRunScriptNodeProps =
  FlowNodeMetadata.createMRFlowNodeProps({
    type: FlowNodeEnum.RUN_SCRIPT_NODE,
    name: '执行脚本',
    props: {
      script: {
        def: mr.string().default(''),
      },
    },
  })

export const runScriptNodeMetadata = FlowNodeMetadata.createMetadata({
  version: '0.0.1',
  type: FlowNodeEnum.RUN_SCRIPT_NODE,
  name: '执行脚本',
  icon: <AndroidOutlined />,
  mrPropsScheme: MRSchemeRunScriptNodeProps,
})
