// TODO START 完善后移动到 core

import { atom, selector } from 'recoil'
import { WidgetBaseProps } from '@modou/core'
import { generateRecoilKey } from '../utils'
import { keyBy } from 'lodash'

export const widgetsAtom = atom<WidgetBaseProps[]>({
  key: generateRecoilKey('widgetsAtom'),
  default: []
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
