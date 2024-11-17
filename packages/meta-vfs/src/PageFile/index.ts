import { isEmpty, isFunction, isObject, keyBy, omit } from 'lodash'

import { WidgetBaseProps } from '@modou/core'
import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from '@modou/reactivity'
import { MDTernDefs } from '@modou/refine'

import { AppFile } from '../AppFile'
import { BaseFile, BaseFileMap, BaseFileMete } from '../BaseFile'
import { FlowFile } from '../FlowFile'
import { WidgetFile, WidgetFileMeta } from '../WidgetFile'
import { FileTypeEnum, UpdateParams } from '../types'

export interface PageFileMeta extends BaseFileMete {
  rootWidgetId: string
}

export interface RelationWidget {
  props: WidgetBaseProps
  file: WidgetFile
  slotPath: string
  parent?: RelationWidget
}

type WidgetRelationById = Record<string, RelationWidget>

type SubFileMap = {
  [FileTypeEnum.Widget]: WidgetFile
  [FileTypeEnum.Flow]: FlowFile
}

export class PageFile extends BaseFile<SubFileMap, PageFileMeta, AppFile> {
  protected constructor(meta: PageFileMeta, parentFile: AppFile) {
    super({
      fileType: FileTypeEnum.App,
      meta,
      parentFile,
      subFileTypes: [FileTypeEnum.Widget, FileTypeEnum.Flow],
    })
  }

  get widgets() {
    return BaseFile.DEFAULT_FILE_STORE.get(this.subFilesAtomMap.Widget)
  }

  get flows() {
    return BaseFile.DEFAULT_FILE_STORE.get(this.subFilesAtomMap.Flow)
  }

  get flowMap() {
    return keyBy(this.flows, (flow) => flow.meta.id)
  }

  deleteFlow = (flowId: string) => {
    const oldFlows = [...this.subFileMap.flows]
    this.subFileMap.flows.length = 0
    this.subFileMap.flows.push(
      ...oldFlows.filter((flow) => flow.meta.id !== flowId),
    )
  }

  get widgetMap() {
    return keyBy(this.subFileMap.widgets, (widget) => widget.meta.id)
  }

  get widgetRelationById(): WidgetRelationById {
    return this.widgets.reduce<WidgetRelationById>((pre, cur) => {
      const widgetId = cur.meta.id
      if (!Reflect.has(pre, widgetId)) {
        pre[widgetId] = {
          props: cur.meta,
          file: cur,
          slotPath: '',
        }
      }
      const parent = pre[widgetId]
      if (!isEmpty(cur.slots)) {
        Object.entries(cur.slots).forEach(([slotPath, slotChildren]) => {
          slotChildren.forEach((widgetId) => {
            if (!Reflect.has(pre, widgetId)) {
              pre[widgetId] = {
                props: this.widgetMap[widgetId].meta,
                file: this.widgetMap[widgetId],
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

  getWidgetStateDefs = () => {
    const DEFINE_KEY = '!define'
    const defs: MDTernDefs = {
      '!name': 'DATA_TREE',
      [DEFINE_KEY]: {},
      // @ts-expect-error
      i: {
        '!type': 'number',
        '!doc': '组件当前所在上下文的层级',
      },
      // TODO 只有表格下面的组件才加currentRow
      currentRow: {
        '!doc': '当前行数据',
      },
    }
    this.subFileMap.widgets.forEach((widget) => {
      Reflect.set(
        defs,
        widget.meta.name,
        omit(widget.stateTypeDefs, DEFINE_KEY),
      )
      defs[DEFINE_KEY] = {
        ...defs[DEFINE_KEY],
        ...widget.stateTypeDefs[DEFINE_KEY],
      }
    })
    return defs
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
    const targetWidget = this.widgetMap[targetWidgetId]
    if (!targetWidget) {
      return
    }
    const sourceWidget = WidgetFile.create(sourceWidgetMeta, this)
    targetWidget.slots[targetSlotPath].splice(
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
    let sourceIndex = -1
    this.subFileMap.widgets.forEach((widget) => {
      // 删除
      if (isObject(widget.slots)) {
        Object.keys(widget.slots).forEach((slotPath) => {
          if (sourceIndex !== -1) {
            return
          }
          sourceIndex = widget.slots[slotPath].findIndex(
            (slotWidgetId) => slotWidgetId === sourceWidgetId,
          )
          if (sourceIndex !== -1) {
            widget.slots[slotPath].splice(sourceIndex, 1)
          }
        })
      }
      // 添加
      if (widget.meta.id === targetWidgetId) {
        // 如果是同一个parent的同一个slot内移动
        const isSameParentSlot =
          this.widgetRelationById[sourceWidgetId]?.parent?.props.id ===
            targetWidgetId &&
          this.widgetRelationById[sourceWidgetId].slotPath === targetSlotPath
        if (isSameParentSlot) {
          widget.slots[targetSlotPath].splice(
            sourceIndex < targetPosition ? targetPosition - 1 : targetPosition,
            0,
            sourceWidgetId,
          )
        } else {
          widget.slots[targetSlotPath].splice(targetPosition, 0, sourceWidgetId)
        }
      }
    })
  }

  deleteWidget(widgetId: string, deleteRaw: boolean = true) {
    this.subFileMap.widgets.forEach((widget) => {
      if (isObject(widget.slots)) {
        Object.keys(widget.slots).forEach((slotPath) => {
          const deletedIndex = widget.slots[slotPath].findIndex(
            (slotWidgetId) => slotWidgetId === widgetId,
          )
          if (deletedIndex !== -1) {
            widget.slots[slotPath].splice(deletedIndex, 1)
          }
        })
      }
    })
    const deletedWidgetIds: string[] = [widgetId]
    const deletedWidgets: WidgetFileMeta[] = [
      this.subFileMap.widgets.find(
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
              this.subFileMap.widgets.find(
                (widget) => widget.meta.id === slotWidgetId,
              ) as unknown as WidgetFileMeta,
            )
          })
        })
      }
    }
    deletedWidgetIds.forEach((deletedWidgetId) => {
      const deletedIndex = this.subFileMap.widgets.findIndex(
        (widget) => widget.meta.id === deletedWidgetId,
      )
      if (deletedIndex !== -1) {
        this.subFileMap.widgets.splice(deletedIndex, 1)
      }
    })
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
      json.widgets.map((widget) =>
        WidgetFile.formJSON(
          widget as unknown as ReturnType<WidgetFile['toJSON']>,
          pageFile,
        ),
      )
      json.flows.map((flow) =>
        FlowFile.formJSON(
          flow as unknown as ReturnType<FlowFile['toJSON']>,
          pageFile,
        ),
      )
      return pageFile
    })
  }
}
