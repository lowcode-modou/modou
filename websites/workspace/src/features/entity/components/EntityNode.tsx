import { Button, Col, Row, Space, Typography } from 'antd'
import { isEmpty } from 'lodash'
import { FC, useEffect, useState } from 'react'
import {
  Handle,
  NodeProps,
  Position,
  useReactFlow,
  useUpdateNodeInternals,
} from 'reactflow'

import { Entity, EntityRelation } from '@modou/core'
import { cx, mcss, useTheme } from '@modou/css-in-js'

import { EntityNodeData } from '../types'
import { generateSourceHandle, generateTargetHandle } from '../utils'

const generateEntityDomId = (entity: Entity) => {
  return `entity_er_node_id_${entity.id}`
}

const generateEntityRelationDomId = (
  entity: Entity,
  relation: EntityRelation,
) => {
  return `${generateEntityDomId(entity)}_${relation.id}`
}

const EntityRelationHeight = 22

const EntityNodeHandle: FC<
  NodeProps<EntityNodeData> & { relation: EntityRelation; passive: boolean }
> = ({
  data: {
    entity,
    entity: { relations },
  },
  isConnectable,
  relation,
  passive,
}) => {
  const theme = useTheme()
  const reactFlow = useReactFlow()
  const updateNodeInternals = useUpdateNodeInternals()
  const id = passive
    ? generateTargetHandle(relation)
    : generateSourceHandle(relation)
  const [top, setTop] = useState(Number.MAX_SAFE_INTEGER)
  useEffect(() => {
    const entityNodeRect = document
      .getElementById(generateEntityDomId(entity))
      ?.getClientRects()[0]
    const entityRelationRect = document
      .getElementById(generateEntityRelationDomId(entity, relation))
      ?.getClientRects()[0]

    const handleTop =
      (entityRelationRect?.top ?? 0) - (entityNodeRect?.top ?? 0)
    setTop(handleTop)
    setTimeout(() => updateNodeInternals(entity.name))
  }, [entity, reactFlow, relation, updateNodeInternals])
  return (
    <Handle
      key={relation.id}
      id={id}
      type={passive ? 'target' : 'source'}
      position={passive ? Position.Left : Position.Right}
      style={{
        background: theme.colorPrimary,
        top: top + EntityRelationHeight / 2,
      }}
      onConnect={(params) => console.log('handle onConnect', params)}
      isConnectable={false}
    />
  )
}

const EntityNodeHandles: FC<NodeProps<EntityNodeData>> = (props) => {
  const {
    data: {
      entity: { relations },
      passiveEntityRelations,
    },
  } = props

  return (
    <>
      {relations.map((relation) => (
        <EntityNodeHandle
          key={relation.id}
          {...props}
          passive={false}
          relation={relation}
        />
      ))}
      {passiveEntityRelations.map((relation) => (
        <EntityNodeHandle
          key={relation.id}
          {...props}
          passive
          relation={relation}
        />
      ))}
    </>
  )
}

const EntityNodeFields: FC<NodeProps<EntityNodeData>> = ({
  data: { entity },
}) => {
  return isEmpty(entity.fields) ? null : (
    <div className={cx(classes.section)}>
      <Typography.Title className={cx(classes.sectionTitle)} level={5}>
        字段
      </Typography.Title>
      {entity.fields.map((field) => (
        <div key={field.name} className={cx(classes.sectionItem)}>
          <Space size={'small'}>
            <Typography.Text>
              {field.description}({field.name})
            </Typography.Text>
            {field.required && (
              <Typography.Text type={'danger'}>*</Typography.Text>
            )}
          </Space>
          <Typography.Text>{field.type}</Typography.Text>
        </div>
      ))}
    </div>
  )
}
const EntityNodeRelations: FC<NodeProps<EntityNodeData>> = ({
  data: {
    entity,
    entity: { relations },
    passiveEntityRelations,
  },
}) => {
  const allRelations = [relations, ...passiveEntityRelations]
  return isEmpty(allRelations) ? null : (
    <div className={cx(classes.section)}>
      <Typography.Title className={cx(classes.sectionTitle)} level={5}>
        关系
      </Typography.Title>
      {relations.map((relation) => (
        <div
          key={relation.name}
          className={cx(classes.sectionItem)}
          id={generateEntityRelationDomId(entity, relation)}
        >
          <Space size={'small'}>
            <Typography.Text>
              {relation.description}({relation.name})
            </Typography.Text>
          </Space>
          <Typography.Text>{relation.type}</Typography.Text>
        </div>
      ))}
      {passiveEntityRelations.map((relation) => (
        <div
          key={relation.targetName}
          className={cx(classes.sectionItem)}
          id={generateEntityRelationDomId(entity, relation)}
        >
          <Space size={'small'}>
            <Typography.Text disabled>
              {relation.targetDescription}({relation.targetName})
            </Typography.Text>
          </Space>
          <Typography.Text disabled>{relation.type}</Typography.Text>
        </div>
      ))}
    </div>
  )
}

export const EntityNode: FC<NodeProps<EntityNodeData>> = (props) => {
  const {
    data: { entity },
  } = props
  const theme = useTheme()
  return (
    <>
      <EntityNodeHandles {...props} />
      <div
        id={generateEntityDomId(entity)}
        style={{
          '--header-bg-color': theme.colorPrimary,
        }}
        className={classes.wrapper}
      >
        <div className={classes.header}>
          <Typography.Title level={5}>{entity.description}</Typography.Title>
        </div>
        <div className={classes.body}>
          <EntityNodeFields {...props} />
          <EntityNodeRelations {...props} />
        </div>
        <Row className={classes.footer}>
          <Col span={12}>
            <Button block type="link">
              编辑
            </Button>
          </Col>
          <Col span={12}>
            <Button block type="text" danger>
              删除
            </Button>
          </Col>
        </Row>
      </div>
    </>
  )
}

const classes = {
  wrapper: mcss`
		width: 300px;
		border-radius: 10px;
		background-color: white;
		overflow: hidden;
    border: solid rgba(0,0,0,.1);
  `,
  header: mcss`
		background-color: var(--header-bg-color);
    padding: 8px 16px;
		.ant-typography {
			color: white;
      margin: 0;
		}
  `,
  body: mcss`
    padding: 4px 0;
  `,
  section: mcss`
  `,
  sectionTitle: mcss`
    color: var(--header-bg-color) !important;
    padding: 0 16px;
		font-size: 14px!important;
    font-weight: normal!important;
    margin-bottom: 0!important;
  `,
  sectionItem: mcss`
    padding: 0 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
		.ant-typography {
			font-size: 12px;
		}
  `,
  footer: mcss`
		border-top: solid rgba(0,0,0,.1);
  `,
}
