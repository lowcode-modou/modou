import { useLocalObservable } from './useLocalObservable'

export const useComputed = <T>(factory: () => T): T => {
  return useLocalObservable(() => ({
    get value() {
      return factory()
    },
  })).value
}
