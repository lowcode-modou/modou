import { produce } from 'immer'
import { flatten, isArray, keyBy } from 'lodash'
import { DefaultValue, selector, selectorFamily } from 'recoil'

import { App, Entity, EntityRelation } from '../types'
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

export const entityRelationsSelector = selector<EntityRelation[]>({
  key: generateRecoilKey('entityRelationsSelector'),
  get: ({ get }) => {
    return flatten(get(entitiesSelector).map((entity) => entity.relations))
  },
})

export const entityRelationsByTargetEntityNameMapSelector = selector<
  Record<string, EntityRelation[]>
>({
  key: generateRecoilKey('entityRelationsByTargetEntityNameMapSelector'),
  get: ({ get }) =>
    get(entityRelationsSelector).reduce<Record<string, EntityRelation[]>>(
      (pre, cur) => {
        // TODO 如果是ManyToOne 的 Lookup 则不在对方双向生成关系
        // if (
        //   cur.type === EntityRelationTypeEnum.Lookup &&
        //   cur.relationType === EntityRelationLookupRelationTypeEnum.ManyToOne
        // ) {
        //   return pre
        // }
        const targetEntityName = cur.targetEntity
        if (!isArray(pre[targetEntityName])) {
          pre[targetEntityName] = []
        }
        pre[targetEntityName].push(cur)
        return pre
      },
      {},
    ),
})

export const entityRelationsBySourceEntityNameMapSelector = selector<
  Record<string, EntityRelation[]>
>({
  key: generateRecoilKey('entityRelationsBySourceEntityNameMapSelector'),
  get: ({ get }) =>
    get(entityRelationsSelector).reduce<Record<string, EntityRelation[]>>(
      (pre, cur) => {
        const sourceEntityName = cur.sourceEntity
        if (!isArray(pre[sourceEntityName])) {
          pre[sourceEntityName] = []
        }
        pre[sourceEntityName].push(cur)
        return pre
      },
      {},
    ),
})
