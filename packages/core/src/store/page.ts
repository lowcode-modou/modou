import { produce } from 'immer'
import { keyBy } from 'lodash'
import { DefaultValue, selector, selectorFamily } from 'recoil'

import { App, Page } from '../types'
import { generateRecoilKey } from '../utils'
import { appAtom } from './app'

export const pagesSelector = selector<Page[]>({
  key: generateRecoilKey('pagesSelector'),
  get: ({ get }) => get(appAtom).pages,
  set: ({ set }, newValue) =>
    set(
      appAtom,
      produce<App>((draft) => {
        if (newValue instanceof DefaultValue) {
          draft.pages = []
        } else {
          draft.pages = newValue
        }
      }),
    ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const pageByIdSelector = selector<Record<string, Page>>({
  key: generateRecoilKey('pageByIdSelector'),
  get: ({ get }) => keyBy(get(pagesSelector), 'id'),
  set: ({ set }, newValue) => {
    set(pagesSelector, Object.values(newValue))
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const pageSelector = selectorFamily<Page, string>({
  key: generateRecoilKey('pageSelector'),
  get:
    (widgetId) =>
    ({ get }) =>
      get(pageByIdSelector)[widgetId],
  set:
    (widgetId) =>
    ({ set }, newValue) =>
      set(
        pageByIdSelector,
        produce((draft) => {
          draft[widgetId] = newValue
        }),
      ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})
