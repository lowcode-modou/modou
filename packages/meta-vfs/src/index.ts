import { configure } from 'mobx'

configure({
  useProxies: 'never',
  enforceActions: 'always',
  // computedRequiresReaction: true,
  // observableRequiresReaction: true,
  reactionRequiresObservable: true,
})

export { default as Foo } from './Foo'
export * from './AppFile'
export * from './PageFile'
export * from './EntityFile'
export * from './EntityFieldFile'
export * from './EntityRelationFile'
export * from './WidgetFile'
export * from './types'
