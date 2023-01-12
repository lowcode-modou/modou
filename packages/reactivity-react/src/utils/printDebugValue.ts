import { Reaction, getDependencyTree } from '@modou/reactivity'

export function printDebugValue(v: Reaction) {
  return getDependencyTree(v)
}
