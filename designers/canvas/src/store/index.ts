// TODO START 完善后移动到 core

import { atom, selector } from 'recoil'
import { WidgetBaseProps } from '@modou/core'
import { generateRecoilKey } from '../utils'
import { keyBy } from 'lodash'
import { syncEffect } from 'recoil-sync'
import { custom } from '@recoiljs/refine'

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

// TODO END
