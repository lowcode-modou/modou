import { atom, DefaultValue, selector, selectorFamily } from 'recoil'
import { generateRecoilKey } from '../utils'
import { App, Page } from '../types'
import { keyBy } from 'lodash'
import { produce } from 'immer'

const appAtom = atom<App>({
  key: generateRecoilKey('metadataAtom'),
  default: {
    id: '',
    name: '',
    pages: [],
    entities: []
  },
  effects: [
    ({ setSelf, onSet }) => {
      const key = 'metadata'
      const savedValue = localStorage.getItem(key)
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue))
      }

      onSet(newValue => {
        if (newValue instanceof DefaultValue) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      })
    }
  ]
})

const pagesSelector = selector<Page[]>({
  key: generateRecoilKey('pagesSelector'),
  get: ({ get }) => get(appAtom).pages,
  set: ({ set }, newValue) => set(appAtom, produce<App>(draft => {
    if (newValue instanceof DefaultValue) {
      draft.pages = []
    } else {
      draft.pages = newValue
    }
  }))
})

const pageByIdSelector = selector<Record<string, Page>>({
  key: generateRecoilKey('pageByIdSelector'),
  get: ({ get }) => keyBy(get(pagesSelector), 'id'),
  set: ({ set }, newValue) => {
    set(Metadata.pagesSelector, Object.values(newValue))
  }
})

const pageSelector = selectorFamily<Page, string>({
  key: generateRecoilKey('pageSelector'),
  get: (widgetId) => ({ get }) => get(pageByIdSelector)[widgetId],
  set: (widgetId) => ({ set }, newValue) => set(pageByIdSelector, produce(draft => {
    draft[widgetId] = newValue
  }))
})

export const Metadata = {
  appAtom,
  pagesSelector,
  pageByIdSelector,
  pageSelector
}
