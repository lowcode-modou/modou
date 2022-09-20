import { atom, selector, selectorFamily } from 'recoil'
import { WidgetBaseProps } from '@modou/core'
import { generateRecoilKey } from '../utils'
import { keyBy } from 'lodash'

export const widgetsAtom = atom<WidgetBaseProps[]>({
  key: generateRecoilKey('widgetsAtom'),
  default: []
})

export const widgetByIdSelector = selector<Record<string, WidgetBaseProps>>({
  key: generateRecoilKey('widgetByIdSelector'),
  get: ({ get }) => keyBy(get(widgetsAtom), 'widgetId')
})

export const widgetSelector = selectorFamily<WidgetBaseProps, string>({
  key: generateRecoilKey('widgetSelector'),
  get: (widgetId) => ({ get }) => get(widgetByIdSelector)[widgetId]
})
