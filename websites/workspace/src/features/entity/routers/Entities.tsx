import { ROUTER_PATH } from '@/constants'
import { useEntityCreator } from '@/features/entity/hooks'
import { BaseRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import useUrlState from '@ahooksjs/use-url-state'
import { PlusOutlined } from '@ant-design/icons'
import { useBoolean } from 'ahooks'
import { Button, Card, Form, Space } from 'antd'
import produce from 'immer'
import { ComponentProps, FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
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

  const [mode, setMode] =
    useState<ComponentProps<typeof EntityCreator>['mode']>('edit')
  const onDeleteEntity = (entityId: string) => {
    setEntityById(
      produce((draft) => {
        Reflect.deleteProperty(draft, entityId)
      }),
    )
  }

  const { open, setFalse, setTrue, onSubmitEntity, form } = useEntityCreator()

  const navigate = useNavigate()
  const params = useParams<BaseRouterParamsKey>()
  const onChangeEntity = (entity: Entity) => {
    navigate(
      generateRouterPath(ROUTER_PATH.Entity, {
        entityId: entity.id,
        appId: params.appId,
      }),
    )

    // setMode('edit')
    // form.setFieldsValue(entity)
    // setTrue()
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
          size={'small'}
          tabProps={{
            size: 'small',
          }}
          className={classes.card}
          title={<span>数据模型</span>}
          tabList={entityTabs}
          tabBarExtraContent={
            <Button
              type="link"
              // icon={<PlusOutlined />}
              onClick={onCreateEntity}
            >
              添加模型
            </Button>
          }
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
    //padding: 16px;
    height: 100%;
  `,
  card: mcss`
		height: 100%;
    display: flex;
    flex-direction: column;
    //.ant-card-head{
    //  position: relative;
    //  display: flex;
    //  align-items: center;
		//	padding: 8px 24px;
		//	&-title{
    //    padding-top: 0;
    //    min-height: auto!important;
    //    display: inline;
    //  }
    //}
    .ant-card-body{
      flex: 1;
      padding: 0;
    }
    //.ant-card-head-tabs{
    //  display: inline-block;
    //  position: absolute;
    //  right: 24px;
    //  top: 0;
		//	height: 100%;
    //  .ant-tabs-nav{
    //    margin-bottom: 0;
    //    height: 100%;
    //  }
    //}
  `,
}
