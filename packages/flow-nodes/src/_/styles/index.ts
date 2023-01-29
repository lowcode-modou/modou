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
  wrapper: mcss`
    border: 1px solid red;
    border-radius: 8px;
    //height: 40px;
    width: 300px;
  `,
  wrapperHeader: mcss`
    background-color: #888888;
    height: 36px;
    display: flex;
    align-items: center;
    padding: 0 16px;
  `,
  wrapperBody: mcss`
    background-color: #747bff;
    padding: 16px;
  `,
  nodeTargetPort: mcss`
    background-color: #535bf2;
  `,
  nodeSourcePort: mcss`
    background-color: seagreen;
    height: 10px;
    width: 10px;
    &.react-flow__handle-right{
      right: -12px;
    }
    &.react-flow__handle-bottom{
      bottom: -12px;
    }
  `,
}
