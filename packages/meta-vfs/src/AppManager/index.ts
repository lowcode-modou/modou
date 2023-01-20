import { flatten } from 'lodash'

import { computed, makeObservable } from '@modou/reactivity'

import { AppFile } from '../AppFile'
import { WidgetFile } from '../WidgetFile'

export class AppManager {
  constructor(appFile: AppFile) {
    this.root = appFile
    makeObservable(this, {
      // root: observable,
      app: computed,
      pageMap: computed.struct,
      entityMap: computed.struct,
      widgetMap: computed.struct,
      entityFieldMap: computed.struct,
      entityRelationMap: computed.struct,
    })
  }

  private readonly root: AppFile

  get app() {
    return this.root
  }

  get pageMap() {
    return new Map(this.app.pages.map((page) => [page.meta.id, page]))
  }

  get entityMap() {
    return new Map(this.app.entities.map((page) => [page.meta.id, page]))
  }

  get widgetMap() {
    // TODO 优化 直接从page.widgetMap 取值
    return this.app.pages.reduce<Record<string, WidgetFile>>((pre, cur) => {
      return { ...pre, ...cur.widgetMap }
    }, {})
  }

  get entityFieldMap() {
    return new Map(
      flatten(
        this.app.entities.map((entity) =>
          entity.subFileMap.entityFields.map((field) => [field.meta.id, field]),
        ),
      ),
    )
  }

  get entityRelationMap() {
    return new Map(
      flatten(
        this.app.entities.map((entity) =>
          entity.subFileMap.entityRelations.map((relation) => [
            relation.meta.id,
            relation,
          ]),
        ),
      ),
    )
  }
}
