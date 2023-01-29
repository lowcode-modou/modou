import { AndroidOutlined } from '@ant-design/icons'

import { FlowNodeMetadata } from '@modou/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mr } from '@modou/refine'

import { FlowNodeEnum } from '../_/types'

export const MRSchemeStartNodeProps = FlowNodeMetadata.createMRFlowNodeProps({
  type: FlowNodeEnum.START_NODE,
  name: '开始',
  props: {},
})

export const startNodeMetadata = FlowNodeMetadata.createMetadata({
  version: '0.0.1',
  type: FlowNodeEnum.START_NODE,
  name: '开始',
  icon: <AndroidOutlined />,
  mrPropsScheme: MRSchemeStartNodeProps,
})
