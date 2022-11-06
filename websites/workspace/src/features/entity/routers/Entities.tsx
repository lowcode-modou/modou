import useUrlState from '@ahooksjs/use-url-state'
import { Card } from 'antd'
import { FC } from 'react'

import { mcss } from '@modou/css-in-js'

import { EntitiesER } from './components/EntitiesER'
import { EntitiesList } from './components/EntitiesList'

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

  return (
    <div className={classes.wrapper}>
      <Card
        tabProps={{
          size: 'small',
        }}
        className={classes.card}
        title={'数据模型'}
        tabList={entityTabs}
        activeTabKey={urlState.activeTabKey}
        onTabChange={(key) =>
          setUrlState({
            activeTabKey: key as unknown as EntityTabKeyEnum,
          })
        }
      >
        {urlState.activeTabKey === EntityTabKeyEnum.List ? (
          <EntitiesList />
        ) : (
          <EntitiesER />
        )}
      </Card>
    </div>
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
    .ant-card-body{
      flex: 1;
    }
  `,
}
