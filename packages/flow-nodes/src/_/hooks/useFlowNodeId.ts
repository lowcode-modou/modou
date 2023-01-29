import { useNodeId } from 'reactflow'

export const useFlowNodeId = () => {
  return useNodeId() as unknown as string
}
