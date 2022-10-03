// TODO START 完善后移动到 core

import { atom, DefaultValue, selector } from 'recoil'
import { Page, WidgetBaseProps } from '@modou/core'
import { generateRecoilKey } from '../utils'
import { isEmpty, keyBy } from 'lodash'
import { syncEffect } from 'recoil-sync'
import { custom } from '@recoiljs/refine'
import produce from 'immer'

export * from './dnd'

export const PAGE_ATOM_KEY = generateRecoilKey('pageAtom')
export const PAGE_ATOM_KEY_STORE_KEY = `${PAGE_ATOM_KEY}_STORE_KEY`

export const selectedWidgetIdAtom = atom<string>({
  key: generateRecoilKey('selectedWidgetIdAtom'),
  default: ''
})
export const pageAtom = atom<Page>({
  key: PAGE_ATOM_KEY,
  default: {
    id: '',
    name: '',
    rootWidgetId: '',
    widgets: []
  },
  effects: [
    syncEffect({
      storeKey: PAGE_ATOM_KEY_STORE_KEY,
      refine: custom<Page>(x => x as Page)
    })
  ]
})

export const widgetsSelector = selector<WidgetBaseProps[]>({
  key: generateRecoilKey('widgetsSelector'),
  get: ({ get }) => get(pageAtom).widgets,
  set: ({ set }, newValue) => set(pageAtom, produce<Page>(draft => {
    if (newValue instanceof DefaultValue) {
      return draft
    }
    draft.widgets = newValue
  }))
})

export const widgetByIdSelector = selector<Record<string, WidgetBaseProps>>({
  key: generateRecoilKey('widgetByIdSelector'),
  get: ({ get }) => {
    return keyBy(get(widgetsSelector), 'widgetId')
  }
})

interface RelationWidget {
  props: WidgetBaseProps
  slotName?: string
  parent?: RelationWidget
}

export type WidgetRelationByWidgetId = Record<string, RelationWidget>
export const widgetRelationByWidgetIdSelector = selector<WidgetRelationByWidgetId>({
  key: generateRecoilKey('widgetRelationByWidgetIdSelectorSelector'),
  get: ({ get }) => {
    const widgetById = get(widgetByIdSelector)
    return get(widgetsSelector).reduce<WidgetRelationByWidgetId>((pre, cur) => {
      const widgetId = cur.widgetId
      if (!Reflect.has(pre, widgetId)) {
        pre[widgetId] = {
          props: cur
        }
      }
      const parent = pre[widgetId]
      if (!isEmpty(cur.slots)) {
        Object.entries(cur.slots).forEach(([slotName, slotChildren]) => {
          slotChildren.forEach(widgetId => {
            if (!Reflect.has(pre, widgetId)) {
              pre[widgetId] = {
                props: widgetById[widgetId],
                parent,
                slotName
              }
            } else {
              pre[widgetId].parent = parent
              pre[widgetId].slotName = slotName
            }
          })
        })
      }
      return pre
    }, {})
  }
})
