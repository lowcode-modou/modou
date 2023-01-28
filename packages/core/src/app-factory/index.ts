import { isEqual, unionWith } from 'lodash'
import { FC } from 'react'

import { mrToJsonSchema, schemeToDefs } from '@modou/refine'
import { BaseSetterProps } from '@modou/setters/src/types'

import { WidgetGroupEnum } from '../types'
import { WidgetMetadata } from '../widget'

interface Widget {
  // FIXME 完善WidgetBaseState定义
  component: FC<any>
  metadata: WidgetMetadata<any, any>
  group: WidgetGroupEnum
}

// TODO 完善 stateTypeDefs 类型
type WidgetRegistry = Record<
  string,
  Widget & { stateTypeDefs: Record<string, any> }
>

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
        isEqual(preMetadata.type, curMetadata.type),
    ).reduce<WidgetRegistry>((pre, cur) => {
      pre[cur.metadata.type] = {
        ...cur,
        stateTypeDefs: schemeToDefs(mrToJsonSchema(cur.metadata.mrStateScheme)),
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
}
