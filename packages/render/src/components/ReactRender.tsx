import {
  InterpolationNode,
  SimpleExpressionNode,
  TextNode,
  baseParse,
} from '@vue/compiler-core'
import { useMemoizedFn, useMount, useUnmount } from 'ahooks'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { flatten } from 'flat'
import { get, isFunction, keys, set } from 'lodash'
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { RecoilRoot } from 'recoil'

import {
  AppFactoryContext,
  AppManagerProvider,
  WidgetBaseProps,
  useAppManager,
} from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { AppManager, PageFile } from '@modou/meta-vfs'
import {
  IReactionDisposer,
  autorun,
  makeAutoObservable,
  runInAction,
} from '@modou/reactivity'
import { observer } from '@modou/reactivity-react'

import {
  CanvasFileContextProvider,
  useCanvasFile,
} from '../contexts/CanvasFileContext'
import { useInitRender } from '../hooks'

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

class Store {
  constructor() {
    makeAutoObservable(this)
  }

  state: Record<string, any> = {}
  props: Record<string, WidgetBaseProps> = {}
}

const store = new Store()

// const ErrorWidget: FC = () => {
//   return <div>Error</div>
// }

const _WidgetWrapper: FC<{
  widgetId: string
}> = ({ widgetId }) => {
  const { appManager } = useAppManager()
  const widget = appManager.widgetMap.get(widgetId)!
  const appFactory = useContext(AppFactoryContext)
  const widgetDef = appFactory.widgetByType[widget.meta.type]
  // TODO any 替换 state 定义
  const WidgetComponent = widgetDef.component

  const renderSlots = useMemo(() => {
    return Object.entries(widgetDef.metadata.slots || {})
      .map(([slotPath, slot]) => {
        return {
          key: slotPath,
          elements: widget.meta.slots[slotPath]?.map((widgetId) => (
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
  }, [widget.meta.slots, widgetDef.metadata.slots])

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
    runInAction(() => {
      set(store.state, widgetId, {
        ...widget.meta.slots,
        ...widgetDef.metadata.initState(widget.meta),
      })
    })
  }

  // reactive props
  if (!get(store.props, widgetId)) {
    runInAction(() => {
      set(store.props, widgetId, widget.meta.props)
    })
  }

  // update reactive props
  useEffect(() => {
    runInAction(() => {
      set(store.props, widgetId, widget.meta.props)
    })
  }, [widget.meta.props, widgetId])

  // TODO 优化类型
  const updateWidgetState = useMemoizedFn(
    <S extends object = {}>(newState: S | ((prevState: S) => S)) => {
      runInAction(() => {
        if (isFunction(newState)) {
          set(store.state, widgetId, newState(get(store.state, widgetId)))
        } else {
          set(store.state, widgetId, newState)
        }
      })
    },
  )

  useEffect(() => {
    // FIXME 为什么会渲染两遍
    updateWidgetState<{}>((prev) => ({
      ...prev,
      ...widget.meta.props,
    }))
  }, [updateWidgetState, widget.meta.props])

  const watchStopsRef = useRef<Record<string, IReactionDisposer>>({})

  useMount(() => {
    const flattenStateKeys = keys(flatten(store.state[widgetId]))
    flattenStateKeys.forEach((path) => {
      if (Reflect.has(watchStopsRef.current, path)) {
        return
      }
      watchStopsRef.current[path] = autorun(() => {
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
          runInAction(() => {
            set(store.state, fullPath, evalExpression(expression))
          })
        } else {
          // set(store.state, `${widgetId}.${path}`, rawPropVal)
        }
      })
    })
  })

  useUnmount(() => {
    //  FIXME
    // Object.values(watchStopsRef.current).forEach((stop) => stop())
  })

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
const WidgetWrapper = observer(_WidgetWrapper)

interface MoDouRenderProps {
  host?: 'simulator' | 'browser'
}

const _ReactRenderTolerant: FC<MoDouRenderProps> = ({ host = 'browser' }) => {
  const { canvasFile } = useCanvasFile()
  const { appManager } = useAppManager()
  // FIXME 判断当前所在环境 是否从props更新widgets  可以加一个 host
  const rootWidget = appManager.widgetMap.get(canvasFile.meta.rootWidgetId)
  return rootWidget ? (
    <WidgetWrapper widgetId={canvasFile.meta.rootWidgetId} />
  ) : (
    <div className={classes.spinWrapper}>
      <Spin size={'large'} />
    </div>
  )
}
const ReactRenderTolerant = observer(_ReactRenderTolerant)

const _ReactRender_: FC<MoDouRenderProps> = (props) => {
  const appFactory = useContext(AppFactoryContext)
  const [appManager, updateAppManager] = useState<AppManager>()
  const [file, updateFile] = useState<PageFile>()
  useInitRender({ updateAppManager, updateFile })
  if (!file || !appManager) {
    return null
  }
  autorun(() => {
    console.log('appManager_autorun', file.widgetMap)
  })
  return (
    <RecoilRoot>
      <ConfigProvider locale={zhCN}>
        <AppFactoryContext.Provider value={appFactory}>
          <AppManagerProvider value={appManager}>
            <CanvasFileContextProvider value={file}>
              <ReactRenderTolerant {...props} />
            </CanvasFileContextProvider>
          </AppManagerProvider>
        </AppFactoryContext.Provider>
      </ConfigProvider>
    </RecoilRoot>
  )
}

export const ReactRender = observer(_ReactRender_)

const classes = {
  spinWrapper: mcss`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
}
