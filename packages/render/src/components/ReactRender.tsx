import { ReactiveEffectRunner, effect, reactive } from '@vue/reactivity'
import { WatchStopHandle, watch } from '@vue/runtime-core'
import { useMemoizedFn, useUpdate } from 'ahooks'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { flatten } from 'flat'
import { parse } from 'handlebars'
import { get, isFunction, keys, set } from 'lodash'
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

const EXPRESSION_REG = /[\s\S]*{{[\s\S]*}}[\s\S]*/m
enum AST_NODE_TYPE {
  ContentStatement = 'ContentStatement',
  MustacheStatement = 'MustacheStatement',
}
const isExpression = (str: unknown) => {
  return typeof str === 'string' && EXPRESSION_REG.test(str)
}
const evalExpression = (expression: string) => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func,no-useless-call
  return new Function(
    'state',
    `with(state){
      return ${expression}
    }`,
  ).call(null, store.state)
}

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

  useEffect(() => {
    const stops: Array<ReactiveEffectRunner | WatchStopHandle> = []
    const watchStop = watch(
      () => store.state[widgetId],
      (newVal) => {
        const fStateKey: string[] = keys(flatten(newVal))
        fStateKey.forEach((path) => {
          stops.push(
            effect(() => {
              const rawPropVal = get(widget.props, path)
              if (isExpression(rawPropVal)) {
                const ast = parse(rawPropVal)
                const expression = `\`${ast.body
                  .map((item) => {
                    if (item.type === AST_NODE_TYPE.ContentStatement) {
                      return (item as unknown as hbs.AST.ContentStatement).value
                    } else if (item.type === AST_NODE_TYPE.MustacheStatement) {
                      return `\${${
                        (
                          (item as unknown as hbs.AST.MustacheStatement)
                            .path as unknown as hbs.AST.PathExpression
                        ).original
                      }}`
                    }
                    // TODO 适配其他类型
                    return ''
                  })
                  .join('')}\``
                set(
                  store.state,
                  `${widgetId}.${path}`,
                  evalExpression(expression),
                )
              } else {
                set(store.state, `${widgetId}.${path}`, rawPropVal)
              }
            }),
          )
        })
      },
      {
        deep: true,
        immediate: true,
      },
    )
    stops.push(watchStop)
    return () => {
      console.log('stops', widget.widgetType, stops)
      stops.forEach((stop) => stop())
    }
  }, [widget.props, widget.widgetType, widgetId])

  const update = useUpdate()
  // state 变化 重新render
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
