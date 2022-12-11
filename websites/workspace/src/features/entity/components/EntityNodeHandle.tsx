import { IconFont } from '@/components'
import { FC, useEffect, useState } from 'react'
import {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from 'reactflow'

import {
  Entity,
  EntityRelation,
  EntityRelationLookupRelationTypeEnum,
  EntityRelationMasterDetailRelationTypeEnum,
} from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { EntityNodeData } from '../types'
import {
  generateEntityDomId,
  generateEntityRelationDomId,
  generateSourceHandle,
  generateTargetHandle,
  getEntityRelationColor,
  isLookupManyToOneRelation,
} from '../utils'

const ENTITY_RELATION_HEIGHT = 22
const ENTITY_NODE_HANDLE_SIZE = 18
const ENTITY_NODE_HEADER_HEIGHT = 40

enum EntityRelationTypeIconEnum {
  One = 'relation-one-one',
  Many = 'relation-one-many',
}

const useHandlePosition = ({
  entity,
  relation,
  passive,
}: {
  entity: Entity
  relation: EntityRelation
  passive: boolean
}) => {
  const reactFlow = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()
  const [top, setTop] = useState(Number.MAX_SAFE_INTEGER)
  useEffect(() => {
    if (passive && isLookupManyToOneRelation(relation)) {
      setTop(ENTITY_NODE_HEADER_HEIGHT / 2 - ENTITY_NODE_HANDLE_SIZE / 2)
    } else {
      const entityNodeRect = document
        .getElementById(generateEntityDomId(entity))
        ?.getClientRects()[0]
      const entityRelationRect = document
        .getElementById(generateEntityRelationDomId(entity, relation))
        ?.getClientRects()[0]

      const handleTop =
        (entityRelationRect?.top ?? 0) - (entityNodeRect?.top ?? 0)
      setTop(handleTop)
    }
    setTimeout(() => updateNodeInternals(entity.name))
  }, [entity, passive, reactFlow, relation, updateNodeInternals])
  return {
    top,
    left: passive ? -ENTITY_NODE_HANDLE_SIZE : 'auto',
    right: !passive ? -ENTITY_NODE_HANDLE_SIZE : 'auto',
  }
}

const useHandleIcon = ({
  relation,
  passive,
}: {
  relation: EntityRelation
  passive: boolean
}) => {
  const [icon, setIcon] = useState<EntityRelationTypeIconEnum>(
    EntityRelationTypeIconEnum.Many,
  )

  useEffect(() => {
    if (passive) {
      switch (relation.relationType) {
        case EntityRelationLookupRelationTypeEnum.ManyToMany:
          setIcon(EntityRelationTypeIconEnum.Many)
          break
        case EntityRelationLookupRelationTypeEnum.ManyToOne:
        case EntityRelationMasterDetailRelationTypeEnum.ManyToOne:
        case EntityRelationMasterDetailRelationTypeEnum.OneToOne:
          setIcon(EntityRelationTypeIconEnum.One)
          break
      }
    } else {
      switch (relation.relationType) {
        case EntityRelationLookupRelationTypeEnum.ManyToMany:
        case EntityRelationLookupRelationTypeEnum.ManyToOne:
        case EntityRelationMasterDetailRelationTypeEnum.ManyToOne:
          setIcon(EntityRelationTypeIconEnum.Many)
          break
        case EntityRelationMasterDetailRelationTypeEnum.OneToOne:
          setIcon(EntityRelationTypeIconEnum.One)
          break
      }
    }
  }, [passive, relation.relationType])

  return { icon, color: getEntityRelationColor(relation) }
}

export const EntityNodeHandle: FC<
  NodeProps<EntityNodeData> & { relation: EntityRelation; passive: boolean }
> = ({
  data: {
    entity,
    entity: { relations },
  },
  relation,
  passive,
}) => {
  const id = passive
    ? generateTargetHandle(relation)
    : generateSourceHandle(relation)
  const { top, left, right } = useHandlePosition({ entity, relation, passive })
  const { icon, color } = useHandleIcon({ relation, passive })
  return (
    <Handle
      className={classes.wrapper}
      key={relation.id}
      id={id}
      type={passive ? 'target' : 'source'}
      position={passive ? Position.Left : Position.Right}
      style={{
        left,
        right,
        top: top + ENTITY_RELATION_HEIGHT / 2,
        // background: theme.colorPrimary,
      }}
      onConnect={(params) => console.log('handle onConnect', params)}
      isConnectable={false}
    >
      <span
        style={{
          color,
          transform: passive ? 'rotateY(0deg)' : 'rotateY(180deg)',
        }}
      >
        <IconFont type={icon} />
      </span>
    </Handle>
  )
}

const classes = {
  wrapper: mcss`
		height: ${ENTITY_NODE_HANDLE_SIZE}px!important;
		width:  ${ENTITY_NODE_HANDLE_SIZE}px!important;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0;
    background-color: transparent!important;
  `,
}
