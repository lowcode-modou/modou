import { flatten } from 'lodash'
import { makeAutoObservable } from 'mobx'

import { AppFile } from '../AppFile'

export class AppManager {
  constructor(appFile: AppFile) {
    this.root = appFile
    makeAutoObservable(this)
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
    return new Map(
      flatten(
        this.app.pages.map((page) =>
          page.subFileMap.widgets.map((widget) => [widget.meta.id, widget]),
        ),
      ),
    )
  }

  get EntityFieldMap() {
    return new Map(
      flatten(
        this.app.entities.map((entity) =>
          entity.subFileMap.entityFields.map((field) => [field.meta.id, field]),
        ),
      ),
    )
  }

  get EntityRelationMap() {
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
