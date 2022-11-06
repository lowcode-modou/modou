import { produce } from 'immer'
import { keyBy } from 'lodash'
import { DefaultValue, selector, selectorFamily } from 'recoil'

import { App, Entity } from '../types'
import { generateRecoilKey } from '../utils'
import { appAtom } from './app'

export const entitiesSelector = selector<Entity[]>({
  key: generateRecoilKey('entitiesSelector'),
  get: ({ get }) => get(appAtom).entities,
  set: ({ set }, newValue) =>
    set(
      appAtom,
      produce<App>((draft) => {
        if (newValue instanceof DefaultValue) {
          draft.entities = []
        } else {
          draft.entities = newValue
        }
      }),
    ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const entityByIdSelector = selector<Record<string, Entity>>({
  key: generateRecoilKey('entityByIdSelector'),
  get: ({ get }) => keyBy(get(entitiesSelector), 'id'),
  set: ({ set }, newValue) => {
    set(entitiesSelector, Object.values(newValue))
  },
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})

export const entitySelector = selectorFamily<Entity, string>({
  key: generateRecoilKey('entitySelector'),
  get:
    (widgetId) =>
    ({ get }) =>
      get(entityByIdSelector)[widgetId],
  set:
    (entityId) =>
    ({ set }, newValue) =>
      set(
        entityByIdSelector,
        produce((draft) => {
          draft[entityId] = newValue
        }),
      ),
  cachePolicy_UNSTABLE: { eviction: 'most-recent' },
})
