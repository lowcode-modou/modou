import { ROUTER_PATH } from '@/constants'
import { BaseRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import useUrlState from '@ahooksjs/use-url-state'
import { Button, Card } from 'antd'
import { ComponentProps, FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { mcss } from '@modou/css-in-js'

import { EntitiesER, EntitiesList, EntityCreator } from '../components'
import { useEntityCreator } from '../hooks'

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

  const [mode, setMode] =
    useState<ComponentProps<typeof EntityCreator>['mode']>('edit')

  const { open, setFalse, setTrue, onSubmitEntity, form } = useEntityCreator()

  const navigate = useNavigate()
  const params = useParams<BaseRouterParamsKey>()
  const navEntityEditor = (entityId: string) => {
    navigate(
      generateRouterPath(ROUTER_PATH.Entity, {
        entityId,
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
            <EntitiesList onClickEditEntity={navEntityEditor} />
          ) : (
            <EntitiesER onClickEditEntity={navEntityEditor} />
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
    .ant-card-body{
      flex: 1;
      padding: 0;
    }
  `,
}
