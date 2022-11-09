import { FC, memo, useCallback } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  Edge,
  MiniMap,
  Node,
  NodeProps,
  OnConnect,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { useRecoilValue } from 'recoil'

import { Metadata } from '@modou/core'
import { mcss, useTheme } from '@modou/css-in-js'

import { EntityNode } from '../components/EntityNode'

const MOCK_NODES: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'An input node' },
    position: { x: 0, y: 50 },
    sourcePosition: Position.Right,
  },
  {
    id: '3',
    type: 'output',
    data: { label: 'Output A' },
    position: { x: 650, y: 25 },
    sourcePosition: Position.Left,
  },
  {
    id: '4',
    type: 'output',
    data: { label: 'Output B' },
    position: { x: 650, y: 100 },
    sourcePosition: Position.Left,
  },
]

const MOCK_EDGES: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '3',
    animated: true,
    style: { stroke: 'red' },
  },
  {
    id: 'e2b-4',
    source: '1',
    target: '4',
    sourceHandle: 'b',
    animated: true,
    style: { stroke: 'red' },
  },
]

const nodeTypes: Record<string, FC<NodeProps>> = {
  EntityNode: memo(EntityNode),
}

export const EntitiesER: FC = () => {
  const entities = useRecoilValue(Metadata.entitiesSelector)
  const theme = useTheme()
  const [nodes, , onNodesChange] = useNodesState([
    ...entities.map((entity, index) => ({
      id: entity.id,
      type: 'EntityNode',
      data: entity,
      position: { x: 400 * (index + 1), y: 100 },
    })),
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState(MOCK_EDGES)
  const onConnect = useCallback<OnConnect>(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, animated: true, style: { stroke: 'green' } }, eds),
      ),
    [setEdges],
  )
  return (
    <div className={classes.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        style={{ background: '#fff' }}
        nodeTypes={nodeTypes}
        connectionLineStyle={{ stroke: theme.colorPrimary }}
        snapToGrid={true}
        snapGrid={[20, 20]}
        // defaultZoom={1.5}
        // fitView
        attributionPosition="bottom-left"
      >
        <Background variant={BackgroundVariant.Cross} gap={10} size={2} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  )
}

const classes = {
  wrapper: mcss`
    height: 100%;
    .react-flow__attribution{
      display: none;
    }
    .react-flow__node{
      border: none;
    }
    .react-flow__handle{
      z-index: 9;
    }
    .react-flow__edges{
      z-index: 99;
    }
    //.react-flow__minimap{
    //  title{
    //    display: none;
    //  }
    //}
  `,
}
