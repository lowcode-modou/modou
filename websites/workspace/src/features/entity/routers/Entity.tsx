import { EntityRouterParamsKey } from '@/types'
import useUrlState from '@ahooksjs/use-url-state'
import { Card } from 'antd'
import { FC } from 'react'
import { useParams } from 'react-router-dom'

import { useAppManager } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { observer } from '@modou/reactivity-react'

import {
  EntityBaseInfo,
  EntityCreator,
  EntityFields,
  EntityModuleActionPortal,
} from '../components'
import { useEntityCreator } from '../hooks'

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

const _Entity: FC = () => {
  const [urlState, setUrlState] = useUrlState<{
    activeTabKey: EntityModuleTabKeyEnum
  }>({
    activeTabKey: EntityModuleTabKeyEnum.Base,
  })
  const { app } = useAppManager()
  const { entityId } = useParams<EntityRouterParamsKey>()
  const entity = app.entityMap.get(entityId!)!
  const { open, setFalse, setTrue, onSubmitEntity, form } = useEntityCreator()

  const buildTabPanel = (tabKey: EntityModuleTabKeyEnum) => {
    switch (tabKey) {
      case EntityModuleTabKeyEnum.Base:
        return (
          <EntityBaseInfo
            entity={entity.meta}
            onEditEntity={() => {
              form.setFieldsValue(entity.meta)
              setTrue()
            }}
          />
        )
      case EntityModuleTabKeyEnum.Field:
        return <EntityFields entityId={entity.meta.id} />
      case EntityModuleTabKeyEnum.Method:
        return <EntityFields entityId={entity.meta.id} />
      case EntityModuleTabKeyEnum.View:
        return <EntityFields entityId={entity.meta.id} />
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
      </>
      <div className={classes.wrapper}>
        <Card
          size={'small'}
          tabProps={{
            size: 'small',
          }}
          title={`${entity.meta.title}(${entity.meta.name})`}
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
export const Entity = observer(_Entity)

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
