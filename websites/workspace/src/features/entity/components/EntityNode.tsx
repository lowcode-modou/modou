import { Button, Col, Row, Space, Typography } from 'antd'
import { isEmpty } from 'lodash'
import { FC } from 'react'
import { NodeProps } from 'reactflow'

import {
  EntityRelationLookupRelationTypeEnum,
  EntityRelationTypeEnum,
} from '@modou/core/src/types/entity-relation'
import { cx, mcss, useTheme } from '@modou/css-in-js'

import { EntityNodeData } from '../types'
import {
  generateEntityDomId,
  generateEntityRelationDomId,
  isLookupManyToOneRelation,
} from '../utils'
import { EntityNodeHandle } from './EntityNodeHandle'

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
  const enabledPassiveEntityRelations = passiveEntityRelations.filter(
    (relation) => !isLookupManyToOneRelation(relation),
  )
  const allRelations = [...relations, ...enabledPassiveEntityRelations]
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
      {enabledPassiveEntityRelations.map((relation) => (
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
          <Col span={8}>
            <Button block type="link">
              新建字段
            </Button>
          </Col>
          <Col span={8}>
            <Button block type="link">
              编辑
            </Button>
          </Col>
          <Col span={8}>
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
