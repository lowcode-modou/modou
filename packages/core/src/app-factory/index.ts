import { FC } from 'react'
import { WidgetMetadata, WidgetBaseProps } from '../widget'
import { isEqual, unionWith } from 'lodash'
import { BaseSetterProps } from '@modou/setters/src/types'
import { Page, WidgetGroupEnum } from '../types'
import { generateId } from '../utils'
import { rowWidgetMetadata } from '@modou/widgets'

interface Widget {
  component: FC<any>
  metadata: WidgetMetadata
  group: WidgetGroupEnum
}

type WidgetRegistry = Record<string, Widget>

type SetterElement = FC<BaseSetterProps<any>>

export class AppFactory {
  constructor({
    widgets,
    setters,
  }: {
    // TODO 增加 package 信息  增加umd引入
    widgets: Widget[]
    setters: Record<string, SetterElement>
  }) {
    this._widgetRegistry = unionWith(
      widgets,
      ({ metadata: preMetadata }, { metadata: curMetadata }) =>
        isEqual(preMetadata.widgetType, curMetadata.widgetType),
    ).reduce<WidgetRegistry>((pre, cur) => {
      pre[cur.metadata.widgetType] = {
        ...cur,
      }
      return pre
    }, {})
    this._setterRegistry = setters
  }

  private readonly _widgetRegistry: WidgetRegistry
  private readonly _setterRegistry: Record<string, FC<BaseSetterProps<any>>>

  get widgetByType(): WidgetRegistry {
    return new Proxy(this._widgetRegistry, {
      get(target: WidgetRegistry, p: string | symbol, receiver: any): any {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p)
        }
        return new Error(`组件【${p.toString()}】未注册`)
      },
    })
  }

  get setterByType() {
    return new Proxy(this._setterRegistry, {
      get(
        target: Record<string, SetterElement>,
        p: string,
        receiver: any,
      ): any {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p)
        }
        return new Error(`Setter【${p.toString()}】未注册`)
      },
    })
  }

  static create(params: {
    // TODO 增加 package 信息  增加umd引入
    widgets: Widget[]
    setters: Record<string, SetterElement>
  }) {
    return new AppFactory(params)
  }

  static generateDefaultPage = (name?: string): Page => {
    const rootWidget = {
      ...WidgetMetadata.mrSchemeToDefaultJson(
        rowWidgetMetadata.jsonPropsSchema,
      ),
      widgetId: generateId(),
      slots: {
        children: [],
      },
    }
    return {
      id: generateId(),
      name: name ?? `页面-${generateId(4)}`,
      widgets: [rootWidget],
      rootWidgetId: rootWidget.widgetId,
    }
  }
}
