import {
  InterpolationNode,
  SimpleExpressionNode,
  TextNode,
  baseParse,
} from '@vue/compiler-core'
import { ReactiveEffectRunner, effect, reactive } from '@vue/reactivity'
import { WatchStopHandle, watch } from '@vue/runtime-core'
import { useMemoizedFn, useMount, useUnmount, useUpdate } from 'ahooks'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { flatten } from 'flat'
import { get, isFunction, keys, set } from 'lodash'
import { FC, memo, useContext, useEffect, useMemo, useRef } from 'react'
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

enum NodeTypes {
  ROOT = 0,
  ELEMENT = 1,
  TEXT = 2,
  COMMENT = 3,
  SIMPLE_EXPRESSION = 4,
  INTERPOLATION = 5,
  ATTRIBUTE = 6,
  DIRECTIVE = 7,
  COMPOUND_EXPRESSION = 8,
  IF = 9,
  IF_BRANCH = 10,
  FOR = 11,
  TEXT_CALL = 12,
  VNODE_CALL = 13,
  JS_CALL_EXPRESSION = 14,
  JS_OBJECT_EXPRESSION = 15,
  JS_PROPERTY = 16,
  JS_ARRAY_EXPRESSION = 17,
  JS_FUNCTION_EXPRESSION = 18,
  JS_CONDITIONAL_EXPRESSION = 19,
  JS_CACHE_EXPRESSION = 20,
  JS_BLOCK_STATEMENT = 21,
  JS_TEMPLATE_LITERAL = 22,
  JS_IF_STATEMENT = 23,
  JS_ASSIGNMENT_EXPRESSION = 24,
  JS_SEQUENCE_EXPRESSION = 25,
  JS_RETURN_STATEMENT = 26,
}

const EXPRESSION_REG = /[\s\S]*{{[\s\S]*}}[\s\S]*/m
const isExpression = (str: unknown): str is string => {
  return typeof str === 'string' && EXPRESSION_REG.test(str)
}
const evalExpression = (expression: string) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval,no-new-func,no-useless-call
    return new Function(
      'state',
      `with(state){
      return ${expression}
    }`,
    ).call(null, store.state)
  } catch (e) {
    return String((e as SyntaxError)?.message) ?? 'Error'
  }
}

const store = reactive<{
  state: Record<string, any>
  props: Record<string, WidgetBaseProps>
}>({ state: {}, props: {} })

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

  // reactive state
  if (!get(store.state, widgetId)) {
    set(store.state, widgetId, {
      ...widget.props,
      ...widgetDef.metadata.initState(widget),
    })
  }

  // reactive props
  if (!get(store.props, widgetId)) {
    set(store.props, widgetId, widget.props)
  }

  // update reactive props
  useEffect(() => {
    set(store.props, widgetId, widget.props)
  }, [widget.props, widgetId])

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

  const watchStopsRef = useRef<
    Record<string, ReactiveEffectRunner | WatchStopHandle>
  >({})

  useMount(() => {
    const flattenStateKeys = keys(flatten(store.state[widgetId]))
    flattenStateKeys.forEach((path) => {
      if (Reflect.has(watchStopsRef.current, path)) {
        return
      }
      watchStopsRef.current[path] = effect(() => {
        const fullPath = `${widgetId}.${path}`
        const rawPropVal = get(store.props, fullPath)
        if (isExpression(rawPropVal)) {
          const ast = baseParse(rawPropVal)
          const expression = `\`${ast.children
            .map((item) => {
              // @ts-expect-error
              if (item.type === NodeTypes.TEXT) {
                return (item as unknown as TextNode).content
                // @ts-expect-error
              } else if (item.type === NodeTypes.INTERPOLATION) {
                const content = (
                  (item as unknown as InterpolationNode)
                    .content as unknown as SimpleExpressionNode
                ).content
                if (content) {
                  return `\${${content}}`
                }
                return ''
              }
              // TODO 适配其他类型
              return item.loc.source
            })
            .join('')}\``
          set(store.state, fullPath, evalExpression(expression))
        } else {
          // set(store.state, `${widgetId}.${path}`, rawPropVal)
        }
      })
    })
  })

  useUnmount(() => {
    Object.values(watchStopsRef.current).forEach((stop) => stop())
  })

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
