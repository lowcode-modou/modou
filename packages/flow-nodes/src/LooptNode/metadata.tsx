import { AndroidOutlined } from '@ant-design/icons'

import { FlowNodeMetadata, FlowNodePortNameEnum } from '@modou/core'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { mr } from '@modou/refine'

import { FlowNodeEnum, ScopedFlowNodePortNameEnum } from '../_/types'

export const MRSchemeLoopNodeProps = FlowNodeMetadata.createMRFlowNodeProps({
  type: FlowNodeEnum.LOOP_NODE,
  name: '循环',
  defaultSources: [
    {
      name: FlowNodePortNameEnum.SOURCE,
    },
    {
      name: ScopedFlowNodePortNameEnum.LOOP_BODY,
    },
  ],
  props: {
    iterable: {
      def: mr.string().default(''),
    },
  },
})

export const loopNodeMetadata = FlowNodeMetadata.createMetadata({
  version: '0.0.1',
  type: FlowNodeEnum.LOOP_NODE,
  name: '循环',
  icon: <AndroidOutlined />,
  mrPropsScheme: MRSchemeLoopNodeProps,
})
