import { ComponentProps, ComponentType, FC, useCallback, useMemo } from 'react'
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  OnConnect,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { mcss } from '@modou/css-in-js'

const _FlowCanvas: FC<{ flowNode: ComponentType<any> }> = ({ flowNode }) => {
  const reactFlowInstance = useReactFlow()

  const [nodes] = useNodesState<any>([
    {
      id: 'demo_id',
      type: 'DEMO',
      data: {},
      position: { x: 100, y: 100 },
    },
    {
      id: 'demo_demo',
      data: {},
      position: { x: 500, y: 500 },
    },
  ])

  const [edges, setEdges] = useEdgesState([])

  const onConnect = useCallback<OnConnect>(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, style: { stroke: 'green' } }, eds),
      ),
    [setEdges],
  )

  const nodeTypes: NodeTypes = useMemo(() => ({ DEMO: flowNode }), [flowNode])

  return (
    <div className={classes.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
      >
        <Controls />
        <Background />
      </ReactFlow>
      <button
        onClick={() => {
          console.log(reactFlowInstance.getNodes())
        }}
      >
        GetNodes
      </button>
      <button
        onClick={() => {
          console.log(reactFlowInstance.getEdges())
        }}
      >
        GetEdges
      </button>
    </div>
  )
}

export const FlowCanvas: FC<ComponentProps<typeof _FlowCanvas>> = (props) => {
  return (
    <ReactFlowProvider>
      <_FlowCanvas {...props} />
    </ReactFlowProvider>
  )
}

const classes = {
  wrapper: mcss`
    height: 600px;
  `,
}
