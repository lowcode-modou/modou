export enum FlowNodeEnum {
  // 开始
  START_NODE = 'START_NODE',
  // 循环
  LOOP_NODE = 'LOOP_NODE',
  // 条件分支
  BRANCH_NODE = 'BRANCH_NODE',
  // 执行脚本
  RUN_SCRIPT_NODE = 'RUN_SCRIPT_NODE',
  // 调用子流程
  INVOKE_SUB_FLOW = 'INVOKE_SUB_FLOW',
}

export enum FlowNodeStatus {
  Expand,
  Collapse,
}
