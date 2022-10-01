// TODO START 完善后移动到 core

import { atom, selector } from 'recoil'
import { WidgetBaseProps } from '@modou/core'
import { generateRecoilKey } from '../utils'
import { isEmpty, keyBy } from 'lodash'
import { syncEffect } from 'recoil-sync'
import { custom } from '@recoiljs/refine'

export * from './dnd'

export const WIDGETS_ATOM_KEY = generateRecoilKey('widgetsAtom')
export const WIDGETS_ATOM_STORE_KEY = `${WIDGETS_ATOM_KEY}_STORE_KEY`
export const widgetsAtom = atom<WidgetBaseProps[]>({
  key: WIDGETS_ATOM_KEY,
  default: [],
  effects: [
    syncEffect({
      storeKey: WIDGETS_ATOM_STORE_KEY,
      refine: custom<WidgetBaseProps[]>(x => x as WidgetBaseProps[])
    })
  ]
})

export const widgetByIdSelector = selector<Record<string, WidgetBaseProps>>({
  key: generateRecoilKey('widgetByIdSelector'),
  get: ({ get }) => {
    return keyBy(get(widgetsAtom), 'widgetId')
  }
})

export const selectedWidgetIdAtom = atom<string>({
  key: generateRecoilKey('selectedWidgetIdAtom'),
  default: ''
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
    return get(widgetsAtom).reduce<WidgetRelationByWidgetId>((pre, cur) => {
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
