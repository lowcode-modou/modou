import { ChangeEventHandler, FC, memo, useCallback } from 'react'
import ReactFlow, {
  Controls,
  Edge,
  Handle,
  MiniMap,
  Node,
  NodeProps,
  OnConnect,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
} from 'reactflow'

import { mcss, useTheme } from '@modou/css-in-js'

const ColorSelectorNode: FC<
  NodeProps<{
    color: string
    onChange: ChangeEventHandler
  }>
> = ({ data, isConnectable }) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        Custom Color Picker Node: <strong>{data.color}</strong>
      </div>
      <input
        className="nodrag"
        type="color"
        onChange={data.onChange}
        defaultValue={data.color}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: '#555' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 10, top: 'auto', background: '#555' }}
        isConnectable={isConnectable}
      />
    </>
  )
}

const MOCK_NODES: Node[] = [
  {
    id: '1',
    type: 'input',
    data: { label: 'An input node' },
    position: { x: 0, y: 50 },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'selectorNode',
    data: { onChange: () => {}, color: 'red' },
    style: { border: '1px solid #777', padding: 10 },
    position: { x: 300, y: 50 },
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
    target: '2',
    animated: true,
    style: { stroke: 'red' },
  },
  {
    id: 'e2a-3',
    source: '2',
    target: '3',
    sourceHandle: 'a',
    animated: true,
    style: { stroke: 'red' },
  },
  {
    id: 'e2b-4',
    source: '2',
    target: '4',
    sourceHandle: 'b',
    animated: true,
    style: { stroke: 'red' },
  },
]

const nodeTypes: Record<string, FC<NodeProps>> = {
  selectorNode: memo(ColorSelectorNode),
}

export const EntitiesER: FC = () => {
  // const entities = useRecoilValue(Metadata.entitiesSelector)
  const theme = useTheme()
  const [nodes, , onNodesChange] = useNodesState(MOCK_NODES)
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
    //.react-flow__minimap{
    //  title{
    //    display: none;
    //  }
    //}
  `,
}
