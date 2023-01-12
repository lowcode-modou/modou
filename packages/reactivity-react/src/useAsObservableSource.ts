import { useState } from 'react'

import { observable, runInAction } from '@modou/reactivity'

import { useDeprecated } from './utils/utils'

export function useAsObservableSource<TSource extends object>(
  current: TSource,
): TSource {
  if ('production' !== process.env.NODE_ENV)
    useDeprecated(
      "[mobx-react-lite] 'useAsObservableSource' is deprecated, please store the values directly in an observable, for example by using 'useLocalObservable', and sync future updates using 'useEffect' when needed. See the README for examples.",
    )
  const [res] = useState(() => observable(current, {}, { deep: false }))
  runInAction(() => {
    Object.assign(res, current)
  })
  return res
}
