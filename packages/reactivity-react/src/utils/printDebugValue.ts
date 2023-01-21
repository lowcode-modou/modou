import { ReactionType, getDependencyTree } from '@modou/reactivity'

export function printDebugValue(v: ReactionType) {
  return getDependencyTree(v)
}
