import { useMemoizedFn } from 'ahooks'
import { ComponentProps, FC } from 'react'
import ReactFlow, {
  Controls,
  Edge,
  Node,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import 'reactflow/dist/base.css'

import { mcss } from '@modou/css-in-js'

import { FunctionIcon, TurboEdge, TurboNode } from './components'
import { TurboNodeData } from './components/TurboNode'

const initialNodes: Array<Node<TurboNodeData>> = [
  {
    id: '1',
    position: { x: 0, y: 0 },
    data: { icon: <FunctionIcon />, title: 'readFile', subline: 'api.ts' },
    type: 'turbo',
  },
  {
    id: '2',
    position: { x: 250, y: 0 },
    data: { icon: <FunctionIcon />, title: 'bundle', subline: 'apiContents' },
    type: 'turbo',
  },
  {
    id: '3',
    position: { x: 0, y: 250 },
    data: { icon: <FunctionIcon />, title: 'readFile', subline: 'sdk.ts' },
    type: 'turbo',
  },
  {
    id: '4',
    position: { x: 250, y: 250 },
    data: { icon: <FunctionIcon />, title: 'bundle', subline: 'sdkContents' },
    type: 'turbo',
  },
  {
    id: '5',
    position: { x: 500, y: 125 },
    data: { icon: <FunctionIcon />, title: 'concat', subline: 'api, sdk' },
    type: 'turbo',
  },
  {
    id: '6',
    position: { x: 750, y: 125 },
    data: { icon: <FunctionIcon />, title: 'fullBundle' },
    type: 'turbo',
  },
]

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
  },
  {
    id: 'e2-5',
    source: '2',
    target: '5',
  },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
  },
  {
    id: 'e5-6',
    source: '5',
    target: '6',
  },
]

const nodeTypes = {
  turbo: TurboNode,
}

const edgeTypes = {
  turbo: TurboEdge,
}

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
}
export const FlowDesigner: FC = (props) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useMemoizedFn<
    Required<ComponentProps<typeof ReactFlow>>['onConnect']
  >((params) => setEdges((els) => addEdge(params, els)))

  return (
    <ReactFlow
      className={classes.reactFlow}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      defaultEdgeOptions={defaultEdgeOptions}
    >
      <Controls showInteractive={false} />
      <svg>
        <defs>
          <linearGradient id="edge-gradient">
            <stop offset="0%" stopColor="#ae53ba" />
            <stop offset="100%" stopColor="#2a8af6" />
          </linearGradient>

          <marker
            id="edge-circle"
            viewBox="-5 -5 10 10"
            refX="0"
            refY="0"
            markerUnits="strokeWidth"
            markerWidth="10"
            markerHeight="10"
            orient="auto"
          >
            <circle stroke="#2a8af6" strokeOpacity="0.75" r="2" cx="0" cy="0" />
          </marker>
        </defs>
      </svg>
    </ReactFlow>
  )
}

export const classes = {
  reactFlow: mcss`
    --bg-color: rgb(17, 17, 17);
    --text-color: rgb(243, 244, 246);
    --node-border-radius: 10px;
    --node-box-shadow: 10px 0 15px rgba(42, 138, 246, 0.3), -10px 0 15px rgba(233, 42, 103, 0.3);
    background-color: var(--bg-color);
    color: var(--text-color);

    .react-flow__node-turbo {
      border-radius: var(--node-border-radius);
      display: flex;
      height: 70px;
      min-width: 150px;
      font-weight: 500;
      letter-spacing: -0.2px;
      box-shadow: var(--node-box-shadow);
    }

    .react-flow__node-turbo .wrapper {
      overflow: hidden;
      display: flex;
      padding: 2px;
      position: relative;
      border-radius: var(--node-border-radius);
      flex-grow: 1;
    }

    .gradient:before {
      content: '';
      position: absolute;
      padding-bottom: calc(100% * 1.41421356237);
      width: calc(100% * 1.41421356237);
      background: conic-gradient(
                from -160deg at 50% 50%,
              #e92a67 0deg,
              #a853ba 120deg,
              #2a8af6 240deg,
              #e92a67 360deg
      );
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      border-radius: 100%;
    }

    .react-flow__node-turbo.selected .wrapper.gradient:before {
      content: '';
      background: conic-gradient(
                from -160deg at 50% 50%,
              #e92a67 0deg,
              #a853ba 120deg,
              #2a8af6 240deg,
              rgba(42, 138, 246, 0) 360deg
      );
      animation: spinner 4s linear infinite;
      transform: translate(-50%, -50%) rotate(0deg);
      z-index: -1;
    }

    @keyframes spinner {
      100% {
        transform: translate(-50%, -50%) rotate(-360deg);
      }
    }

    .react-flow__node-turbo .inner {
      background: var(--bg-color);
      padding: 16px 20px;
      border-radius: var(--node-border-radius);
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex-grow: 1;
      position: relative;
    }

    .react-flow__node-turbo .icon {
      margin-right: 8px;
    }

    .react-flow__node-turbo .body {
      display: flex;
    }

    .react-flow__node-turbo .title {
      font-size: 16px;
      margin-bottom: 2px;
      line-height: 1;
    }

    .react-flow__node-turbo .subline {
      font-size: 12px;
      color: #777;
    }

    .react-flow__node-turbo .cloud {
      border-radius: 100%;
      width: 30px;
      height: 30px;
      right: 0;
      position: absolute;
      top: 0;
      transform: translate(50%, -50%);
      display: flex;
      transform-origin: center center;
      padding: 2px;
      overflow: hidden;
      box-shadow: var(--node-box-shadow);
      z-index: 1;
    }

    .react-flow__node-turbo .cloud div {
      background-color: var(--bg-color);
      flex-grow: 1;
      border-radius: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .react-flow__handle {
      opacity: 0;
    }

    .react-flow__handle.source {
      right: -10px;
    }

    .react-flow__handle.target {
      left: -10px;
    }

    .react-flow__node:focus {
      outline: none;
    }

    .react-flow__edge .react-flow__edge-path {
      stroke: url(#edge-gradient);
      stroke-width: 2;
      stroke-opacity: 0.75;
    }

    .react-flow__controls button {
      background-color: var(--bg-color);
      color: var(--text-color);
      border: 1px solid #95679e;
      border-bottom: none;
    }

    .react-flow__controls button:hover {
      background-color: rgb(37, 37, 37);
    }

    .react-flow__controls button:first-child {
      border-radius: 5px 5px 0 0;
    }

    .react-flow__controls button:last-child {
      border-bottom: 1px solid #95679e;
      border-radius: 0 0 5px 5px;
    }

    .react-flow__controls button path {
      fill: var(--text-color);
    }

    .react-flow__attribution {
      background: rgba(200, 200, 200, 0.2);
    }

    .react-flow__attribution a {
      color: #95679e;
    }

  `,
}
