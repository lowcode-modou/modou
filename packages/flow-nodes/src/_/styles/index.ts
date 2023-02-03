import { mcss } from '@modou/css-in-js'

export const nodeClasses = {
  // node: mcss`
  //   border-radius: 8px;
  //   display: flex;
  //   height: 60px;
  //   width: 300px;
  //   letter-spacing: -0.2px;
  //   box-shadow: var(--node-box-shadow);
  // `,
  nodeTargetPort: mcss`
    &.react-flow__handle{
      background-color: #535bf2;
      height: 10px;
      width: 10px;
    }
    &.react-flow__handle-left{
      left: -12px;
    }
    &.react-flow__handle-top{
      top: -12px;
    }
  `,
  nodeSourcePort: mcss`
    &.react-flow__handle{
      background-color: seagreen;
      height: 10px;
      width: 10px;
    }
    &.react-flow__handle-right{
      right: -12px;
    }
    &.react-flow__handle-bottom{
      bottom: -12px;
    }
  `,
}
