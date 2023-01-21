import { configure } from '@modou/reactivity'

configure({
  useProxies: 'never',
  enforceActions: 'always',
  // computedRequiresReaction: true,
  // observableRequiresReaction: true,
  reactionRequiresObservable: true,
})

export * from './AppFile'
export * from './PageFile'
export * from './EntityFile'
export * from './EntityFieldFile'
export * from './EntityRelationFile'
export * from './WidgetFile'
export * from './types'
//
export * from './AppManager'
// export class AppManager {
//   constructor(app: AppFile) {
//     this.app = app
//   }
//
//   app: AppFile
//   // constructor(appFile: AppFile) {
//   //   this.root = appFile
//   //   makeAutoObservable(this)
//   // }
//   //
//   // private readonly root: AppFile
//   //
//   // get app() {
//   //   return this.root
//   // }
//   //
//   // get pageMap() {
//   //   return new Map(this.app.pages.map((page) => [page.meta.id, page]))
//   // }
//   //
//   // get entityMap() {
//   //   return new Map(this.app.entities.map((page) => [page.meta.id, page]))
//   // }
//   //
//   // get widgetMap() {
//   //   return new Map(
//   //     flatten(
//   //       this.app.pages.map((page) =>
//   //         page.subFileMap.widgets.map((widget) => [widget.meta.id, widget]),
//   //       ),
//   //     ),
//   //   )
//   // }
//   //
//   // get EntityFieldMap() {
//   //   return new Map(
//   //     flatten(
//   //       this.app.entities.map((entity) =>
//   //         entity.subFileMap.entityFields.map((field) => [field.meta.id, field]),
//   //       ),
//   //     ),
//   //   )
//   // }
//   //
//   // get EntityRelationMap() {
//   //   return new Map(
//   //     flatten(
//   //       this.app.entities.map((entity) =>
//   //         entity.subFileMap.entityRelations.map((relation) => [
//   //           relation.meta.id,
//   //           relation,
//   //         ]),
//   //       ),
//   //     ),
//   //   )
//   // }
// }
