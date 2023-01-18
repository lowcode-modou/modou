import produce from 'immer'
import { isEmpty, isFunction, isObject, omit } from 'lodash'

import { WidgetBaseProps } from '@modou/core'
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'

import { AppFile } from '../AppFile'
import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { WidgetFile, WidgetFileMeta } from '../WidgetFile'
import { FileTypeEnum, UpdateParams } from '../types'

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
      deleteWidget: action,
      updateWidgets: action,
      moveWidget: action,
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

  moveWidget({
    sourceWidgetId,
    targetWidgetId,
    targetPosition,
    targetSlotPath,
  }: {
    sourceWidgetId: string
    targetWidgetId: string
    targetPosition: number
    targetSlotPath: string
  }) {
    this.updateWidgets(
      produce((draft) => {
        let sourceIndex = -1
        draft.forEach((widget) => {
          // 删除
          if (isObject(widget.meta.slots)) {
            Object.keys(widget.meta.slots).forEach((slotPath) => {
              if (sourceIndex !== -1) {
                return
              }
              sourceIndex = widget.meta.slots[slotPath].findIndex(
                (slotWidgetId) => slotWidgetId === sourceWidgetId,
              )
              if (sourceIndex !== -1) {
                widget.meta.slots[slotPath].splice(sourceIndex, 1)
              }
            })
          }
          // 添加
          if (widget.meta.id === targetWidgetId) {
            // 如果是同一个parent的同一个slot内移动
            const isSameParentSlot =
              this.widgetRelationById[sourceWidgetId]?.parent?.props.id ===
                targetWidgetId &&
              this.widgetRelationById[sourceWidgetId].slotPath ===
                targetSlotPath
            if (isSameParentSlot) {
              widget.meta.slots[targetSlotPath].splice(
                sourceIndex < targetPosition
                  ? targetPosition - 1
                  : targetPosition,
                0,
                sourceWidgetId,
              )
            } else {
              widget.meta.slots[targetSlotPath].splice(
                targetPosition,
                0,
                sourceWidgetId,
              )
            }
          }
        })
      }),
    )
  }

  deleteWidget(widgetId: string, deleteRaw: boolean = true) {
    this.updateWidgets(
      produce((draft) => {
        draft.forEach((widget) => {
          if (isObject(widget.meta.slots)) {
            Object.keys(widget.meta.slots).forEach((slotPath) => {
              const deletedIndex = widget.meta.slots[slotPath].findIndex(
                (slotWidgetId) => slotWidgetId === widgetId,
              )
              if (deletedIndex !== -1) {
                widget.meta.slots[slotPath].splice(deletedIndex, 1)
              }
            })
          }
        })
        const deletedWidgetIds: string[] = [widgetId]
        const deletedWidgets: WidgetFileMeta[] = [
          draft.find(
            (widget) => widget.meta.id === widgetId,
          ) as unknown as WidgetFileMeta,
        ]
        while (!isEmpty(deletedWidgets)) {
          const currentDeletedWidget = deletedWidgets.shift() as WidgetBaseProps
          if (isObject(currentDeletedWidget.slots)) {
            Object.values(currentDeletedWidget.slots).forEach((widgetIds) => {
              widgetIds.forEach((slotWidgetId) => {
                deletedWidgetIds.push(slotWidgetId)
                deletedWidgets.push(
                  draft.find(
                    (widget) => widget.meta.id === slotWidgetId,
                  ) as unknown as WidgetFileMeta,
                )
              })
            })
          }
        }
        deletedWidgetIds.forEach((deletedWidgetId) => {
          const deletedIndex = draft.findIndex(
            (widget) => widget.meta.id === deletedWidgetId,
          )
          if (deletedIndex !== -1) {
            draft.splice(deletedIndex, 1)
          }
        })
      }),
    )
  }

  // TODO 改成 setWidgets
  updateWidgets(widgets: UpdateParams<WidgetFile[]>) {
    const oldWidgets = [...this.subFileMap.widgets]
    this.subFileMap.widgets.length = 0
    if (isFunction(widgets)) {
      this.subFileMap.widgets.push(...widgets(oldWidgets))
    } else {
      this.subFileMap.widgets.push(...widgets)
    }
  }

  toJSON() {
    return {
      ...this.meta,
      ...this.subFileMapToJson(),
      fileType: this.fileType,
    }
  }

  static create(meta: Omit<PageFileMeta, 'version'>, parentFile: AppFile) {
    return runInAction(() => {
      const pageFile = new PageFile(
        {
          ...meta,
          version: '0.0.1',
        },
        parentFile,
      )
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
