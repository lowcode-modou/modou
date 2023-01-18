import { Button, Col, Empty, Row, Space, Typography } from 'antd'
import { isEmpty } from 'lodash'
import { FC } from 'react'
import { NodeProps } from 'reactflow'

import { cx, mcss, useTheme } from '@modou/css-in-js'

import { entityEmitter } from '../mitts'
import { EntityNodeData } from '../types'
import {
  generateEntityDomId,
  generateEntityRelationDomId,
  isLookupManyToOneRelation,
} from '../utils'
import { EntityNodeHandle } from './EntityNodeHandle'

const EntityNodeHandles: FC<NodeProps<EntityNodeData>> = (props) => {
  const {
    data: { entity, passiveEntityRelations },
  } = props
  return (
    <>
      {entity.entityRelations.map((relation) => (
        <EntityNodeHandle
          key={relation.meta.id}
          {...props}
          passive={false}
          relation={relation}
        />
      ))}
      {passiveEntityRelations.map((relation) => (
        <EntityNodeHandle
          key={relation.meta.id}
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
  return (
    <div className={cx(classes.section)}>
      <Typography.Title className={cx(classes.sectionTitle)} level={5}>
        字段
      </Typography.Title>
      {isEmpty(entity.entityFields) ? (
        <Empty description={'暂无字段'} />
      ) : (
        entity.entityFields.map((field) => (
          <div key={field.meta.name} className={cx(classes.sectionItem)}>
            <Space size={'small'}>
              <Typography.Text>
                {field.meta.description}({field.meta.name})
              </Typography.Text>
              {field.meta.required && (
                <Typography.Text type={'danger'}>*</Typography.Text>
              )}
            </Space>
            <Typography.Text>{field.meta.type}</Typography.Text>
          </div>
        ))
      )}
    </div>
  )
}
const EntityNodeRelations: FC<NodeProps<EntityNodeData>> = ({
  data: { entity, passiveEntityRelations },
}) => {
  const enabledPassiveEntityRelations = passiveEntityRelations.filter(
    (relation) => !isLookupManyToOneRelation(relation.meta),
  )
  const allRelations = [
    ...entity.entityRelations,
    ...enabledPassiveEntityRelations,
  ]
  return isEmpty(allRelations) ? null : (
    <div className={cx(classes.section)}>
      <Typography.Title className={cx(classes.sectionTitle)} level={5}>
        关系
      </Typography.Title>
      {entity.entityRelations.map((relation) => (
        <div
          key={relation.meta.name}
          className={cx(classes.sectionItem)}
          id={generateEntityRelationDomId(entity.meta, relation.meta)}
        >
          <Space size={'small'}>
            <Typography.Text>
              {relation.meta.description}({relation.meta.name})
            </Typography.Text>
          </Space>
          <Typography.Text>{relation.meta.type}</Typography.Text>
        </div>
      ))}
      {enabledPassiveEntityRelations.map((relation) => (
        <div
          key={relation.meta.targetName}
          className={cx(classes.sectionItem)}
          id={generateEntityRelationDomId(entity.meta, relation.meta)}
        >
          <Space size={'small'}>
            <Typography.Text disabled>
              {relation.meta.targetDescription}({relation.meta.targetName})
            </Typography.Text>
          </Space>
          <Typography.Text disabled>{relation.meta.type}</Typography.Text>
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
        id={generateEntityDomId(entity.meta)}
        style={{
          '--header-bg-color': theme.colorPrimary,
        }}
        className={classes.wrapper}
      >
        <div className={classes.header}>
          <Typography.Title level={5}>{entity.meta.title}</Typography.Title>
        </div>
        <div className={classes.body}>
          <EntityNodeFields {...props} />
          <EntityNodeRelations {...props} />
        </div>
        <Row className={classes.footer}>
          {/* <Col span={8}>
            <Button
              block
              type="link"
              onClick={() => {
                console.log('新建字段')
              }}
            >
              新建字段
            </Button>
          </Col> */}
          <Col span={12}>
            <Button
              block
              type="link"
              onClick={() =>
                entityEmitter.emit('onClickEditEntity', entity.meta.id)
              }
            >
              编辑
            </Button>
          </Col>
          <Col span={12}>
            <Button
              block
              type="text"
              danger
              onClick={() => entityEmitter.emit('onDelete', entity.meta.id)}
            >
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
    border: 1px solid rgba(0,0,0,.1);
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
		border-top:1px solid rgba(0,0,0,.1);
  `,
}
