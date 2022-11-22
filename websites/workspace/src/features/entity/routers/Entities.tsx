import useUrlState from '@ahooksjs/use-url-state'
import { PlusOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Button, Card, Form, Space } from 'antd'
import produce from 'immer'
import { ComponentProps, FC, useState } from 'react'
import { useSetRecoilState } from 'recoil'

import { AppFactory, Entity, Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { EntitiesER, EntitiesList, EntityCreator } from '../components'

enum EntityTabKeyEnum {
  List = 'List',
  ER = 'ER',
}
const entityTabs: Array<{ key: EntityTabKeyEnum; tab: string }> = [
  {
    key: EntityTabKeyEnum.List,
    tab: '列表',
  },
  {
    key: EntityTabKeyEnum.ER,
    tab: 'ER图',
  },
]

export const Entities: FC = () => {
  const [urlState, setUrlState] = useUrlState<{
    activeTabKey: EntityTabKeyEnum
  }>({
    activeTabKey: EntityTabKeyEnum.List,
  })

  const setEntityById = useSetRecoilState(Metadata.entityByIdSelector)

  const [open, { setFalse, setTrue }] = useBoolean(false)
  const [mode, setMode] =
    useState<ComponentProps<typeof EntityCreator>['mode']>('edit')
  const [form] = Form.useForm<Entity>()

  const onSubmitEntity = (entity: Entity) => {
    setEntityById(
      produce((draft) => {
        if (Reflect.has(draft, entity.id)) {
          // 编辑
          draft[entity.id] = {
            ...draft[entity.id],
            ...entity,
          }
        } else {
          // 新建
          const newEntity = AppFactory.generateDefaultEntity(entity)
          const maxX = Math.max(
            ...Object.values(draft).map((entity) => entity.position.x),
          )
          draft[newEntity.id] = {
            ...newEntity,
            position: {
              x: maxX + 400,
              y: 100,
            },
          }
        }
      }),
    )
    setFalse()
  }

  const onDeleteEntity = (entityId: string) => {
    setEntityById(
      produce((draft) => {
        Reflect.deleteProperty(draft, entityId)
      }),
    )
  }

  const onChangeEntity = (entity: Entity) => {
    setMode('edit')
    form.setFieldsValue(entity)
    setTrue()
  }
  const onCreateEntity = () => {
    setMode('create')
    setTrue()
  }

  return (
    <>
      <EntityCreator
        onOk={onSubmitEntity}
        onCancel={setFalse}
        open={open}
        mode={mode}
        form={form}
      />
      <div className={classes.wrapper}>
        <Card
          tabProps={{
            size: 'small',
          }}
          className={classes.card}
          title={
            <Space>
              <span>数据模型</span>
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={onCreateEntity}
              />
            </Space>
          }
          tabList={entityTabs}
          activeTabKey={urlState.activeTabKey}
          onTabChange={(key) =>
            setUrlState({
              activeTabKey: key as unknown as EntityTabKeyEnum,
            })
          }
        >
          {urlState.activeTabKey === EntityTabKeyEnum.List ? (
            <EntitiesList
              onDeleteEntity={onDeleteEntity}
              onChangeEntity={onChangeEntity}
            />
          ) : (
            <EntitiesER
              onDeleteEntity={onDeleteEntity}
              onChangeEntity={onChangeEntity}
            />
          )}
        </Card>
      </div>
    </>
  )
}

const classes = {
  wrapper: mcss`
    padding: 16px;
    height: 100%;
  `,
  card: mcss`
		height: 100%;
    display: flex;
    flex-direction: column;
    .ant-card-head{
      position: relative;
      display: flex;
      align-items: center;
			padding: 8px 24px;
			&-title{
        padding-top: 0;
        min-height: auto!important;
        display: inline;
      }
    }
    .ant-card-body{
      flex: 1;
      padding: 0;
    }
    .ant-card-head-tabs{
      display: inline-block;
      position: absolute;
      right: 24px;
      top: 0;
			height: 100%;
      .ant-tabs-nav{
        margin-bottom: 0;
        height: 100%;
      }
    }
  `,
}
