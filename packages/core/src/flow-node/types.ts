import { mr } from '@modou/refine'

import { FlowNodeMetadata, MRFlowNodeProps } from './FlowNodeMetadata'

export type FlowNodeBaseProps = mr.infer<
  ReturnType<typeof FlowNodeMetadata.createMRFlowNodeProps<MRFlowNodeProps>>
>
export enum FlowNodePortNameEnum {
  SOURCE = 'SOURCE',
  TARGET = 'TARGET',
}

export type FlowNodeInterpreter<P extends FlowNodeBaseProps> = (
  props: P,
) => void
