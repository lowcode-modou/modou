import { entityEmitter } from '@/features/entity/mitts'
import { keyBy } from 'lodash'
import { FC, memo, useCallback, useEffect } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  NodeChange,
  NodeProps,
  OnConnect,
  addEdge,
  applyNodeChanges,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { useRecoilState, useRecoilValue } from 'recoil'

import { Entity, Metadata } from '@modou/core'
import { mcss, useTheme } from '@modou/css-in-js'

import { EntityNode } from '../components/EntityNode'
import { generateSourceHandle, getEntityRelationColor } from '../utils'

const nodeTypes: Record<string, FC<NodeProps>> = {
  EntityNode: memo(EntityNode),
}

const useEntityNodeState = () => {
  const [entities, setEntities] = useRecoilState(Metadata.entitiesSelector)
  const passiveEntityRelations = useRecoilValue(
    Metadata.entityRelationsByTargetEntityNameMapSelector,
  )
  const [nodes, setNodes, onNodesChange] = useNodesState(
    entities.map((entity) => ({
      id: entity.name,
      type: 'EntityNode',
      data: {
        entity,
        passiveEntityRelations: passiveEntityRelations[entity.name] || [],
      },
      position: entity.position,
    })),
  )

  const _onNodeChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes)
      const nodeChanges = applyNodeChanges(changes, nodes)
      // 同步元数据 position
      const positionChangesByEntityName = keyBy(
        changes.filter((change) => change.type === 'position'),
        'id',
      )
      const nodeChangeByEntityName = keyBy(nodeChanges, (node) => node.id)
      setEntities((pre) => {
        return pre.map((entity) => {
          if (Reflect.has(positionChangesByEntityName, entity.name)) {
            return {
              ...entity,
              position:
                nodeChangeByEntityName[entity.name]?.positionAbsolute ??
                entity.position,
            }
          }
          return entity
        })
      })
    },
    [nodes, onNodesChange, setEntities],
  )

  // 元数据同步画布
  useEffect(() => {
    setNodes((pre) => {
      const nodeByEntityName = keyBy(pre, (node) => node.id)
      return entities.map((entity) => {
        if (nodeByEntityName[entity.name]) {
          return {
            ...nodeByEntityName[entity.name],
            data: {
              entity,
              passiveEntityRelations: passiveEntityRelations[entity.name] || [],
            },
            position: entity.position,
          }
        } else {
          return {
            id: entity.name,
            type: 'EntityNode',
            data: {
              entity,
              passiveEntityRelations: passiveEntityRelations[entity.name] || [],
            },
            position: entity.position,
          }
        }
      })
    })
  }, [entities, passiveEntityRelations, setNodes])

  return {
    nodes,
    onNodesChange: _onNodeChange,
  }
}

export const EntitiesER: FC<{
  onChangeEntity: (entity: Entity) => void
  onDeleteEntity: (entityId: string) => void
}> = ({ onChangeEntity, onDeleteEntity }) => {
  const theme = useTheme()

  const entityRelations = useRecoilValue(Metadata.entityRelationsSelector)

  const { nodes, onNodesChange } = useEntityNodeState()

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

  useEffect(() => {
    entityEmitter.on('onDelete', onDeleteEntity)
    entityEmitter.on('onChange', onChangeEntity)
    return () => {
      entityEmitter.off('onDelete', onDeleteEntity)
      entityEmitter.off('onChange', onChangeEntity)
    }
  }, [onChangeEntity, onDeleteEntity])

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
