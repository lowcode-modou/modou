import { FC } from 'react'
import { Widget } from '../widget'
import { isEqual, unionWith } from 'lodash'
import { BaseSetterProps } from '@modou/setters/src/types'

type WidgetRegistry = Record<string, { element: FC<any>, metadata: Widget }>

type SetterElement = FC<BaseSetterProps<any>>

export class WidgetFactory {
  constructor ({
    widgets,
    setters
  }: {
    // TODO 增加 package 信息  增加umd引入
    widgets: Array<[FC<any>, Widget]>
    setters: Record<string, SetterElement>
  }) {
    this._widgetRegistry =
      unionWith(widgets, ([, preMetadata], [, curMetadata]) => isEqual(preMetadata.widgetType, curMetadata.widgetType))
        .reduce<WidgetRegistry>((pre, cur) => {
        pre[cur[1].widgetType] = {
          element: cur[0],
          metadata: cur[1]
        }
        return pre
      }, {})
    this._setterRegistry = setters
  }

  private readonly _widgetRegistry: WidgetRegistry
  private readonly _setterRegistry: Record<string, FC<BaseSetterProps<any>>>

  get widgetByType (): WidgetRegistry {
    return new Proxy(this._widgetRegistry, {
      get (target: WidgetRegistry, p: string | symbol, receiver: any): any {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p)
        }
        return new Error(`组件【${p.toString()}】未注册`)
      }
    })
  }

  get setterByType () {
    return new Proxy(this._setterRegistry, {
      get (target: Record<string, SetterElement>, p: string, receiver: any): any {
        if (Reflect.has(target, p)) {
          return Reflect.get(target, p)
        }
        return new Error(`Setter【${p.toString()}】未注册`)
      }
    })
  }

  static create (
    params: {
      // TODO 增加 package 信息  增加umd引入
      widgets: Array<[FC<any>, Widget<string>]>
      setters: Record<string, SetterElement>
    }
  ) {
    return new WidgetFactory(params)
  }
}
