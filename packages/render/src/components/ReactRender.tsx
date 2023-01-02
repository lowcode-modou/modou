import { reactive } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
import { useMemoizedFn, useUpdate } from 'ahooks'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { get, isFunction, set } from 'lodash'
import { FC, memo, useContext, useEffect, useMemo } from 'react'
import {
  RecoilRoot,
  atom,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'

import { AppFactoryContext, WidgetBaseProps } from '@modou/core'
import { mcss } from '@modou/css-in-js'

import { useInitRender } from '../hooks'
import { widgetSelector, widgetsAtom } from '../store'

const store = reactive<{ state: Record<string, any> }>({ state: {} })

// const ErrorWidget: FC = () => {
//   return <div>Error</div>
// }

const WidgetWrapper: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const widget = useRecoilValue(widgetSelector(widgetId))
  const appFactory = useContext(AppFactoryContext)
  const widgetDef = appFactory.widgetByType[widget.widgetType]
  // TODO any 替换 state 定义
  const WidgetComponent = widgetDef.component

  const renderSlots = useMemo(() => {
    return Object.entries(widgetDef.metadata.slots || {})
      .map(([slotPath, slot]) => {
        return {
          key: slotPath,
          elements: widget.slots[slotPath]?.map((widgetId) => (
            <WidgetWrapper key={widgetId} widgetId={widgetId} />
          )),
        }
      })
      .reduce<Record<string, Element[]>>((pre, { key, elements }) => {
        // FIXME 不知道为什么类型不对😂
        // pre[key] = elements
        Reflect.set(pre, key, elements)
        return pre
      }, {})
  }, [widget.slots, widgetDef.metadata.slots])

  const renderSlotPaths = useMemo(() => {
    return Object.keys(renderSlots).reduce<Record<string, string>>(
      (pre, cur) => {
        pre[cur] = cur
        return pre
      },
      {},
    )
  }, [renderSlots])

  if (!get(store.state, widgetId)) {
    set(store.state, widgetId, {
      ...widget.props,
      ...widgetDef.metadata.initState(widget),
    })
  }

  // TODO 优化类型
  const updateWidgetState = useMemoizedFn(
    <S extends object = {}>(newState: S | ((prevState: S) => S)) => {
      if (isFunction(newState)) {
        set(store.state, widgetId, newState(get(store.state, widgetId)))
      } else {
        set(store.state, widgetId, newState)
      }
    },
  )

  useEffect(() => {
    // FIXME 为什么会渲染两遍
    updateWidgetState<{}>((prev) => ({
      ...prev,
      ...widget.props,
    }))
  }, [updateWidgetState, widget.props])

  const update = useUpdate()
  useEffect(() => {
    const stop = watch(
      () => store.state[widgetId],
      () => {
        update()
      },
      { deep: true, immediate: true },
    )
    return () => {
      stop()
    }
  }, [update, widgetId])

  // FIXME 会导致重新渲染
  // FIXME 完善组件类型
  return (
    <WidgetComponent
      {...store.state[widgetId]}
      updateState={updateWidgetState}
      renderSlots={renderSlots}
      renderSlotPaths={renderSlotPaths}
    />
  )
}

interface MoDouRenderProps {
  rootWidgetId: string
  widgets: WidgetBaseProps[]
  host?: 'simulator' | 'browser'
}

const MemoWidgetWrapper = memo(WidgetWrapper)
const rootWidgetIdAtom = atom({
  key: 'rootWidgetIdAtom@ReactRender',
  default: '',
})
const _ReactRender: FC<MoDouRenderProps> = ({
  widgets,
  rootWidgetId: _rootWidgetId,
  host = 'browser',
}) => {
  // TODO 使用 recoil-async
  const setWidgets = useSetRecoilState(widgetsAtom)
  const [rootWidgetId, setRootWidgetId] = useRecoilState(rootWidgetIdAtom)

  useInitRender({ setWidgets, setRootWidgetId })

  // FIXME 判断当前所在环境 是否从props更新widgets  可以加一个 host
  useEffect(() => {
    if (host === 'browser') {
      setWidgets(widgets)
      setRootWidgetId(_rootWidgetId)
    }
  }, [_rootWidgetId, host, setRootWidgetId, setWidgets, widgets])

  const rootWidget = useRecoilValue(widgetSelector(rootWidgetId))
  return rootWidget ? (
    <MemoWidgetWrapper widgetId={rootWidgetId} />
  ) : (
    <div className={classes.spinWrapper}>
      <Spin size={'large'} />
    </div>
  )
}

export const ReactRender: FC<MoDouRenderProps> = (props) => {
  const appFactory = useContext(AppFactoryContext)
  return (
    <RecoilRoot>
      <ConfigProvider locale={zhCN}>
        <AppFactoryContext.Provider value={appFactory}>
          <_ReactRender {...props} />
        </AppFactoryContext.Provider>
      </ConfigProvider>
    </RecoilRoot>
  )
}

const classes = {
  spinWrapper: mcss`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
}
