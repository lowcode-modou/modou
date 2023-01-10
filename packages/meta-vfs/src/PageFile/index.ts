import { isEmpty, omit } from 'lodash'
import { action, computed, makeObservable, observable, runInAction } from 'mobx'

import { WidgetBaseProps } from '@modou/core'

import { AppFile } from '../AppFile'
import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { WidgetFile, WidgetFileMeta } from '../WidgetFile'
import { FileTypeEnum } from '../types'

export interface PageFileMeta extends BaseFileMete {
  rootWidgetId: string
}

export interface RelationWidget {
  props: WidgetBaseProps
  slotPath: string
  parent?: RelationWidget
}

type WidgetRelationById = Record<string, RelationWidget>

interface FileMap extends BaseFileMap {
  readonly widgets: WidgetFile[]
}
export class PageFile extends BaseFile<FileMap, PageFileMeta, AppFile> {
  protected constructor(meta: PageFileMeta, parentFile: AppFile) {
    super({ fileType: FileTypeEnum.App, meta, parentFile })
    makeObservable(this, {
      subFileMap: observable,
      widgets: computed,
      widgetMap: computed,
      widgetRelationById: computed,
      addWidget: action,
    })
  }

  subFileMap: FileMap = {
    widgets: [],
  }

  get widgets() {
    return this.subFileMap.widgets
  }

  get widgetMap() {
    return new Map(this.widgets.map((widget) => [widget.meta.id, widget]))
  }

  get widgetRelationById(): WidgetRelationById {
    return this.widgets.reduce<WidgetRelationById>((pre, cur) => {
      const widgetId = cur.meta.id
      if (!Reflect.has(pre, widgetId)) {
        pre[widgetId] = {
          props: cur.meta,
          slotPath: '',
        }
      }
      const parent = pre[widgetId]
      if (!isEmpty(cur.meta.slots)) {
        Object.entries(cur.meta.slots).forEach(([slotPath, slotChildren]) => {
          slotChildren.forEach((widgetId) => {
            if (!Reflect.has(pre, widgetId)) {
              pre[widgetId] = {
                props: this.widgetMap.get(widgetId)?.meta!,
                parent,
                slotPath,
              }
            } else {
              pre[widgetId].parent = parent
              pre[widgetId].slotPath = slotPath
            }
          })
        })
      }
      return pre
    }, {})
  }

  addWidget({
    sourceWidgetMeta,
    targetPosition,
    targetSlotPath,
    targetWidgetId,
  }: {
    sourceWidgetMeta: WidgetFileMeta
    targetWidgetId: string
    targetPosition: number
    targetSlotPath: string
  }) {
    const sourceWidget = WidgetFile.create(sourceWidgetMeta, this)
    const targetWidget = this.widgetMap.get(targetWidgetId)
    if (!targetWidget) {
      return
    }
    this.widgets.push(sourceWidget)
    targetWidget.meta.slots[targetSlotPath].splice(
      targetPosition,
      0,
      sourceWidget.meta.id,
    )
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: PageFileMeta, parentFile: AppFile) {
    return runInAction(() => {
      const pageFile = new PageFile(meta, parentFile)
      parentFile.pages.push(pageFile)
      return pageFile
    })
  }

  static formJSON(
    json: ReturnType<PageFile['toJSON']>,
    parentFile: AppFile,
  ): PageFile {
    return runInAction(() => {
      const pageFile = PageFile.create(
        omit(json, ['fileType', 'widgets']),
        parentFile,
      )
      const widgets = json.widgets.map((widget) =>
        WidgetFile.formJSON(
          widget as unknown as ReturnType<WidgetFile['toJSON']>,
          pageFile,
        ),
      )
      pageFile.subFileMap.widgets.push(...widgets)
      return pageFile
    })
  }
}
