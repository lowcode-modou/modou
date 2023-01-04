import { watch } from '@vue/runtime-core'
import { useUpdate } from 'ahooks'
import { isArray } from 'lodash'
import { useEffect, useRef } from 'react'

type WatchSource<T = any> = () => T
type MultiWatchSources = Array<WatchSource<unknown>>
type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? Immediate extends true
      ? V | undefined
      : V
    : T[K] extends object
    ? Immediate extends true
      ? T[K] | undefined
      : T[K]
    : never
}
export function useReadFile<T>(source: () => T): T
export function useReadFile<T extends MultiWatchSources>(
  source: () => [...T],
): MapSources<T, false>
export function useReadFile<T = any>(source: T) {
  const UPDATE_REF = useRef<{
    PROMISE: 'PENDING' | 'FINISHED'
    value: any | any[]
  }>({
    PROMISE: 'FINISHED',
    value: undefined,
  })
  const update = useUpdate()
  useEffect(() => {
    const stop = watch(
      source as unknown as any,
      (newVal) => {
        if (UPDATE_REF.current.PROMISE === 'PENDING') {
          // 不更新
        } else {
          // 优化同一个组件的渲染性能，统一批次渲染UI
          UPDATE_REF.current.value = newVal
          UPDATE_REF.current.PROMISE = 'PENDING'
          void Promise.resolve(() => {
            update()
            UPDATE_REF.current.PROMISE = 'FINISHED'
          })
        }
      },
      { immediate: true },
    )
    return () => {
      stop()
    }
  }, [source, update])
  return UPDATE_REF.current.value
}
