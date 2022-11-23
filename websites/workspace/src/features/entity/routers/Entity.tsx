import { useEntityCreator } from '@/features/entity/hooks'
import { EntityRouterParamsKey } from '@/types'
import useUrlState from '@ahooksjs/use-url-state'
import { Card } from 'antd'
import { FC } from 'react'
import { useParams } from 'react-router-dom'
import { useRecoilValue } from 'recoil'

import { Metadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import {
  EntityBaseInfo,
  EntityCreator,
  EntityFieldCreator,
  EntityFields,
  EntityModuleActionPortal,
} from '../components'

enum EntityModuleTabKeyEnum {
  Base = 'Base',
  Field = 'Field',
  Method = 'Method',
  View = 'View',
}

const entityModuleTabs: Array<{ key: EntityModuleTabKeyEnum; tab: string }> = [
  {
    key: EntityModuleTabKeyEnum.Base,
    tab: '基础信息',
  },
  {
    key: EntityModuleTabKeyEnum.Field,
    tab: '字段和关系',
  },
  {
    key: EntityModuleTabKeyEnum.Method,
    tab: '方法',
  },
  {
    key: EntityModuleTabKeyEnum.View,
    tab: '视图',
  },
]

export const Entity: FC = () => {
  const [urlState, setUrlState] = useUrlState<{
    activeTabKey: EntityModuleTabKeyEnum
  }>({
    activeTabKey: EntityModuleTabKeyEnum.Base,
  })
  const { entityId } = useParams<EntityRouterParamsKey>()
  const entity = useRecoilValue(Metadata.entitySelector(entityId as string))
  const { open, setFalse, setTrue, onSubmitEntity, form } = useEntityCreator()

  const buildTabPanel = (tabKey: EntityModuleTabKeyEnum) => {
    switch (tabKey) {
      case EntityModuleTabKeyEnum.Base:
        return (
          <EntityBaseInfo
            entity={entity}
            onEditEntity={() => {
              form.setFieldsValue(entity)
              setTrue()
            }}
          />
        )
      case EntityModuleTabKeyEnum.Field:
        return <EntityFields entity={entity} />
      case EntityModuleTabKeyEnum.Method:
        return <EntityFields entity={entity} />
      case EntityModuleTabKeyEnum.View:
        return <EntityFields entity={entity} />
      default:
        return <div>未知模块</div>
    }
  }

  return (
    <>
      <>
        <EntityCreator
          onOk={onSubmitEntity}
          onCancel={setFalse}
          open={open}
          mode={'edit'}
          form={form}
        />
        <EntityFieldCreator />
      </>
      <div className={classes.wrapper}>
        <Card
          size={'small'}
          tabProps={{
            size: 'small',
          }}
          title={`${entity.title}(${entity.name})`}
          tabList={entityModuleTabs}
          tabBarExtraContent={<EntityModuleActionPortal />}
          className={classes.card}
          activeTabKey={urlState.activeTabKey}
          onTabChange={(key) =>
            setUrlState({
              activeTabKey: key as unknown as EntityModuleTabKeyEnum,
            })
          }
        >
          {buildTabPanel(urlState.activeTabKey)}
        </Card>
      </div>
    </>
  )
}

const classes = {
  wrapper: mcss`
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
