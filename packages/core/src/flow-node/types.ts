import { mr } from '@modou/refine'

import { FlowNodeMetadata, MRFlowNodeProps } from './FlowNodeMetadata'

export type FlowNodeBaseProps = mr.infer<
  ReturnType<typeof FlowNodeMetadata.createMRFlowNodeProps<MRFlowNodeProps>>
>
export enum FlowNodePortNameEnum {
  SOURCE = 'SOURCE',
  TARGET = 'TARGET',
}
