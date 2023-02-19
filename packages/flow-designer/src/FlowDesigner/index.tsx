import { mapValues } from 'lodash'
import { ComponentProps, FC, useMemo, useState } from 'react'
import ReactFlow, { Controls, ReactFlowProvider } from 'reactflow'

import { useAppFactory } from '@modou/asset-vfs'
import { mcss } from '@modou/css-in-js'
import { FlowFile } from '@modou/meta-vfs/src/FlowFile'
import { observer } from '@modou/reactivity-react'
import { getMonitorWall } from '@modou/shared'

import { TurboEdge, TurboNode } from './components'
import { ContextMenu } from './components/ContextMenu'

const NODE_TYPES = {
  turbo: TurboNode,
}

const edgeTypes = {
  turbo: TurboEdge,
}

const defaultEdgeOptions = {
  type: 'turbo',
  markerEnd: 'edge-circle',
}
export const UOFlowDesigner: FC<{ file: FlowFile }> = ({ file }) => {
  const { appFactory } = useAppFactory()

  const [contextMenuOpen, setContextMenuOpen] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  const nodeTypes = useMemo(() => {
    return {
      ...NODE_TYPES,
      ...mapValues(appFactory.flowNodeByType, (f) => f.component),
    }
  }, [])

  return (
    <div className={classes.wrapper}>
      <>
        <ContextMenu
          position={contextMenuPosition}
          open={contextMenuOpen}
          file={file}
          setOpen={setContextMenuOpen}
        />
        <ReactFlow
          className={classes.reactFlow}
          nodes={file.reactFlowNodes}
          edges={file.reactFlowEdges}
          onNodesChange={file.onReactFlowNodesChange}
          onEdgesChange={file.onReactFlowEdgesChange}
          onConnect={file.onReactFlowConnect}
          fitView
          maxZoom={1}
          minZoom={1}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          onContextMenu={(e) => {
            const target = e.target as unknown as HTMLDivElement
            if (!target.classList.contains('react-flow__pane')) {
              return
            }

            const { left, top } = getMonitorWall(target)

            setContextMenuPosition({
              x: e.clientX - left,
              y: e.clientY - top,
            })
            setContextMenuOpen(true)
            e.preventDefault()
          }}
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
                <circle
                  stroke="#2a8af6"
                  strokeOpacity="0.75"
                  r="2"
                  cx="0"
                  cy="0"
                />
              </marker>
            </defs>
          </svg>
        </ReactFlow>
      </>
    </div>
  )
}

const _FlowDesigner = observer(UOFlowDesigner)

export const FlowDesigner: FC<ComponentProps<typeof _FlowDesigner>> = (
  props,
) => {
  return (
    <ReactFlowProvider>
      <_FlowDesigner {...props} />
    </ReactFlowProvider>
  )
}

export const classes = {
  wrapper: mcss`
    position: relative;
    height: 100%;
  `,
  reactFlow: mcss`
    //--bg-color: rgb(17, 17, 17);
    --bg-color: rgb(255,255,255);
    //--text-color: rgb(243, 244, 246);
    --text-color: rgb(0, 0, 0);
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
