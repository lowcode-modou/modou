import useUrlState from '@ahooksjs/use-url-state'
import { useMemoizedFn } from 'ahooks'
import { Empty } from 'antd'
import { FC } from 'react'

import { mcss } from '@modou/css-in-js'
import { PageFile } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'

import { FlowCanvas } from './FlowCanvas'
import { FlowList } from './FlowList'

export const UOCanvasFlow: FC<{
  parentFile: PageFile
}> = ({ parentFile }) => {
  const [urlState, setUrlState] = useUrlState<{ flowId: string }>({
    flowId: '',
  })
  const flowFile = parentFile.flowMap[urlState.flowId]
  const setActiveFlowId = useMemoizedFn((flowId) => {
    setUrlState({
      flowId,
    })
  })
  return (
    <div className={classes.wrapper}>
      <FlowList
        activeFlowId={urlState.flowId}
        setActiveFlowId={setActiveFlowId}
      />
      {flowFile ? (
        <FlowCanvas file={flowFile} />
      ) : (
        <Empty description="暂未选中流" className={classes.empty} />
      )}
    </div>
  )
}
export const CanvasFlow = observer(UOCanvasFlow)

const classes = {
  wrapper: mcss`
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
  `,
  empty: mcss`
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
}
