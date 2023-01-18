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

import { useAppManager } from '@modou/core'
import { mcss, useTheme } from '@modou/css-in-js'
import { runInAction } from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'

import { entityEmitter } from '../mitts'
import { generateSourceHandle, getEntityRelationColor } from '../utils'
import { EntityNode } from './EntityNode'

const nodeTypes: Record<string, FC<NodeProps>> = {
  EntityNode: memo(EntityNode),
}

const useEntityNodeState = () => {
  const { app } = useAppManager()
  const passiveEntityRelations = app.entityRelationsByTargetEntityNameMap

  const [nodes, setNodes, onNodesChange] = useNodesState(
    app.entities.map((entity) => ({
      id: entity.meta.name,
      type: 'EntityNode',
      data: {
        entity,
        passiveEntityRelations:
          passiveEntityRelations.get(entity.meta.name) || [],
      },
      position: entity.meta.position,
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
      runInAction(() => {
        app.entities.forEach((entity) => {
          if (Reflect.has(positionChangesByEntityName, entity.meta.name)) {
            entity.updateMeta({
              ...entity.meta,
              position:
                nodeChangeByEntityName[entity.meta.name]?.positionAbsolute ??
                entity.meta.position,
            })
          }
        })
      })
    },
    [app, nodes, onNodesChange],
  )

  // 元数据同步画布
  useEffect(() => {
    setNodes((pre) => {
      const nodeByEntityName = keyBy(pre, (node) => node.id)
      return app.entities.map((entity) => {
        if (nodeByEntityName[entity.meta.name]) {
          return {
            ...nodeByEntityName[entity.meta.name],
            data: {
              entity,
              passiveEntityRelations:
                passiveEntityRelations.get(entity.meta.name) || [],
            },
            position: entity.meta.position,
          }
        } else {
          return {
            id: entity.meta.name,
            type: 'EntityNode',
            data: {
              entity,
              passiveEntityRelations:
                passiveEntityRelations.get(entity.meta.name) || [],
            },
            position: entity.meta.position,
          }
        }
      })
    })
  }, [app.entities, passiveEntityRelations, setNodes])

  return {
    nodes,
    onNodesChange: _onNodeChange,
  }
}

const _EntitiesER: FC<{
  onClickEditEntity: (entityId: string) => void
}> = ({ onClickEditEntity }) => {
  const theme = useTheme()
  const { app, appManager } = useAppManager()

  const entityRelations = [...appManager.entityRelationMap.values()]
  const { nodes, onNodesChange } = useEntityNodeState()

  const [edges, setEdges, onEdgesChange] = useEdgesState(
    entityRelations.map((entityRelation) => {
      return {
        id: entityRelation.meta.id,
        source: entityRelation.meta.sourceEntity,
        target: entityRelation.meta.targetEntity,
        sourceHandle: generateSourceHandle(entityRelation.meta),
        targetHandle: generateSourceHandle(entityRelation.meta),
        style: {
          stroke: getEntityRelationColor(entityRelation.meta),
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
    entityEmitter.on('onDelete', app.deleteEntity)
    entityEmitter.on('onClickEditEntity', onClickEditEntity)
    return () => {
      entityEmitter.off('onDelete', app.deleteEntity)
      entityEmitter.off('onClickEditEntity', onClickEditEntity)
    }
  }, [app.deleteEntity, onClickEditEntity])

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
export const EntitiesER = observer(_EntitiesER)

const classes = {
  wrapper: mcss`
    height: 100%;

    .react-flow__attribution {
      display: none;
    }

    .react-flow__node {
      border: none;
    }

    .react-flow__handle {
      z-index: 9;
    }

    .react-flow__edges {
      z-index: 999999 !important;
    }

    //.react-flow__minimap{
    //  title{
    //    display: none;
    //  }
    //}
  `,
}
