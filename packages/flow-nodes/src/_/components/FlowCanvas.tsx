import {
  ComponentProps,
  ComponentType,
  FC,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
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

import { FlowNodeMetadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { FlowNodeProps, OnChangeNode } from '../types'

const _FlowCanvas: FC<{
  flowNode: ComponentType<any>
  meta: FlowNodeMetadata<any>
  runInterpreter: (props: FlowNodeProps<any>) => void
}> = ({ flowNode, meta, runInterpreter }) => {
  const reactFlowInstance = useReactFlow()

  const [nodes, setNodes] = useNodesState<FlowNodeProps>([])

  const [edges, setEdges] = useEdgesState([])

  useEffect(() => {
    const defaultProps = FlowNodeMetadata.mrSchemeToDefaultJson(
      meta.jsonPropsSchema,
    )

    const _onChangeNode: OnChangeNode = (node) => {
      setNodes((nds) =>
        nds.map((nd) => {
          if (nd.id !== node.id) {
            return nd
          }
          return {
            ...nd,
            ...node,
          }
        }),
      )
    }

    setNodes([
      {
        id: defaultProps.id,
        type: defaultProps.type,
        data: {
          ...defaultProps,
          _onChangeNode,
        },
        position: defaultProps.position,
      },
      {
        id: 'demo_demo',
        data: {
          name: 'demo',
          id: 'demo_demo',
          type: 'demo',
          sources: [],
          targets: [],
          position: { x: 500, y: 500 },
          _onChangeNode,
        } as any,
        position: { x: 500, y: 500 },
      },
    ])
  }, [])

  const onConnect = useCallback<OnConnect>(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, style: { stroke: 'green' } }, eds),
      ),
    [setEdges],
  )

  const nodeTypes: NodeTypes = useMemo(
    () => ({ [meta.type]: flowNode }),
    [flowNode, meta.type],
  )

  useEffect(() => {
    console.log('FlowCanvas 重新渲染了')
  })

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
          console.log(nodes)
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
      <button
        onClick={() => {
          runInterpreter(nodes[0].data)
        }}
      >
        RunInterpreter
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
