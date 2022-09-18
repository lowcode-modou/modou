// TODO START 完善后移动到 core

import { atom, selector } from 'recoil'
import { WidgetBaseProps } from '@modou/core'
import { generateRecoilKey } from '../utils'
import { keyBy } from 'lodash'

export const widgetsAtom = atom<WidgetBaseProps[]>({
  key: generateRecoilKey('widgets'),
  default: []
})

export const widgetByIdSelector = selector<Record<string, WidgetBaseProps>>({
  key: generateRecoilKey('widgetById'),
  get: ({ get }) => {
    console.log('get(widgetsAtom)', get(widgetsAtom))
    return keyBy(get(widgetsAtom), 'widgetId')
  }
})

// TODO END
