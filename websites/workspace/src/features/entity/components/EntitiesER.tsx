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
import { EntityNodeData } from '../types'
import { generateSourceHandle, getEntityRelationColor } from '../utils'

const nodeTypes: Record<string, FC<NodeProps>> = {
  EntityNode: memo(EntityNode),
}

export const EntitiesER: FC = () => {
  const theme = useTheme()
  const entities = useRecoilValue(Metadata.entitiesSelector)
  const entityRelations = useRecoilValue(Metadata.entityRelationsSelector)
  const entityRelationsByTargetEntityNameMap = useRecoilValue(
    Metadata.entityRelationsByTargetEntityNameMapSelector,
  )
  const [nodes, , onNodesChange] = useNodesState<EntityNodeData>([
    ...entities.map((entity, index) => ({
      id: entity.name,
      type: 'EntityNode',
      data: {
        entity,
        passiveEntityRelations:
          entityRelationsByTargetEntityNameMap[entity.name] || [],
      },
      position: { x: 400 * (index + 1), y: 100 },
    })),
  ])
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    entityRelations.map((entityRelation) => {
      return {
        id: entityRelation.id,
        source: entityRelation.sourceEntity,
        target: entityRelation.targetEntity,
        sourceHandle: generateSourceHandle(entityRelation),
        targetHandle: generateSourceHandle(entityRelation),
        style: {
          stroke: getEntityRelationColor(entityRelation),
          zIndex: 999999,
        },
      }
    }),
  )
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
        connectionLineStyle={{ stroke: theme.colorPrimary, zIndex: 999999 }}
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
      z-index: 999999!important;
    }
    //.react-flow__minimap{
    //  title{
    //    display: none;
    //  }
    //}
  `,
}
