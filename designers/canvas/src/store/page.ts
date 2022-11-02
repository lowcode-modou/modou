// TODO START 完善后移动到 core
import { custom } from '@recoiljs/refine'
import { DataNode } from 'antd/es/tree'
import produce from 'immer'
import { head, isEmpty, keyBy } from 'lodash'
import { DefaultValue, atom, selector, selectorFamily } from 'recoil'
import { syncEffect } from 'recoil-sync'

import { Page, WidgetBaseProps } from '@modou/core'

import { generateRecoilKey } from '../utils'

export * from './dnd'

export const PAGE_ATOM_KEY = generateRecoilKey('_pageAtom')
export const PAGE_ATOM_KEY_STORE_KEY = `${PAGE_ATOM_KEY}_STORE_KEY`

export const selectedWidgetIdAtom = atom<string>({
  key: generateRecoilKey('selectedWidgetIdAtom'),
  default: '',
})
export const PAGE_ATOM_STATUS = {
  canUpdate: true,
}
const _pageAtom = atom<Page>({
  key: PAGE_ATOM_KEY,
  default: {
    id: '',
    name: '',
    rootWidgetId: '',
    widgets: [],
  },
  effects: [
    syncEffect({
      storeKey: PAGE_ATOM_KEY_STORE_KEY,
      refine: custom<Page>((x) => x as Page),
      // syncDefault 什么作用
      // syncDefault: true
    }),
  ],
})
export const pageSelector = selector<Page>({
  key: generateRecoilKey('pageSelector'),
  get: ({ get }) => get(_pageAtom),
  set: ({ set }, newValue) => {
    PAGE_ATOM_STATUS.canUpdate = false
    set(_pageAtom, newValue)
  },
})

export const widgetsSelector = selector<WidgetBaseProps[]>({
  key: generateRecoilKey('widgetsSelector'),
  get: ({ get }) => get(pageSelector).widgets,
  set: ({ set }, newValue) =>
    set(
      pageSelector,
      produce<Page>((draft) => {
        if (newValue instanceof DefaultValue) {
          return draft
        }
        draft.widgets = newValue
      }),
    ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const widgetByIdSelector = selector<Record<string, WidgetBaseProps>>({
  key: generateRecoilKey('widgetByIdSelector'),
  get: ({ get }) => {
    return keyBy(get(widgetsSelector), 'id')
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const widgetSelector = selectorFamily<WidgetBaseProps, string>({
  key: generateRecoilKey('widgetSelector'),
  get:
    (widgetId) =>
    ({ get }) =>
      get(widgetByIdSelector)[widgetId],
  set:
    (widgetId) =>
    ({ set, get }, newValue) => {
      set(
        widgetsSelector,
        Object.values(
          produce(get(widgetByIdSelector), (draft) => {
            if (newValue instanceof DefaultValue) {
              return draft
            } else {
              draft[widgetId] = newValue
            }
          }),
        ),
      )
    },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

interface RelationWidget {
  props: WidgetBaseProps
  slotName?: string
  parent?: RelationWidget
}

export type WidgetRelationByWidgetId = Record<string, RelationWidget>
export const widgetRelationByWidgetIdSelector =
  selector<WidgetRelationByWidgetId>({
    key: generateRecoilKey('widgetRelationByWidgetIdSelectorSelector'),
    get: ({ get }) => {
      const widgetById = get(widgetByIdSelector)
      return get(widgetsSelector).reduce<WidgetRelationByWidgetId>(
        (pre, cur) => {
          const widgetId = cur.id
          if (!Reflect.has(pre, widgetId)) {
            pre[widgetId] = {
              props: cur,
            }
          }
          const parent = pre[widgetId]
          if (!isEmpty(cur.slots)) {
            Object.entries(cur.slots).forEach(([slotName, slotChildren]) => {
              slotChildren.forEach((widgetId) => {
                if (!Reflect.has(pre, widgetId)) {
                  pre[widgetId] = {
                    props: widgetById[widgetId],
                    parent,
                    slotName,
                  }
                } else {
                  pre[widgetId].parent = parent
                  pre[widgetId].slotName = slotName
                }
              })
            })
          }
          return pre
        },
        {},
      )
    },
    cachePolicy_UNSTABLE: { eviction: 'most-recent' },
  })

export type WidgetTreeNode = DataNode & {
  widget?: WidgetBaseProps
  page?: Page
  nodeType: 'page' | 'slot' | 'widget'
  children: WidgetTreeNode[]
}

export const pageOutlineTreeSelector = selector<WidgetTreeNode>({
  key: generateRecoilKey('pageOutlineTreeSelector'),
  get: ({ get }) => {
    const page = get(pageSelector)
    const widgetById = get(widgetByIdSelector)
    const rootWidget = widgetById[page.rootWidgetId]

    const parentTreeNodes: WidgetTreeNode[] = [
      {
        key: page.id,
        title: page.name,
        page,
        nodeType: 'page',
        children: [],
      },
    ]
    const rootTreeNode = head(parentTreeNodes)
    const widgetStack: WidgetBaseProps[] = [rootWidget]
    while (widgetStack.length !== 0) {
      const curWidget = widgetStack.pop()
      const curTreeNode: WidgetTreeNode = {
        key: curWidget?.id ?? '',
        title: curWidget?.widgetName ?? '',
        nodeType: 'widget',
        widget: curWidget,
        children: [],
      }
      // treeNodeMap.set(curWidget?.widgetId ?? '', curTreeNode)
      const parentTreeNode = parentTreeNodes.pop()
      parentTreeNode?.children.unshift(curTreeNode)
      if (!isEmpty(curWidget?.slots?.children)) {
        curWidget?.slots?.children.forEach((widgetId: string) => {
          widgetStack.push(widgetById[widgetId])
          parentTreeNodes.push(curTreeNode)
        })
      }
    }
    return rootTreeNode as WidgetTreeNode
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const isRootWidgetSelector = selectorFamily<boolean, string>({
  key: generateRecoilKey('isRootWidgetSelector'),
  get:
    (widgetId) =>
    ({ get }) =>
      !get(widgetRelationByWidgetIdSelector)[widgetId].parent,
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})
