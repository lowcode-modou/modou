import 'react'

declare module 'react' {
  interface Attributes {
    ['data-widget-id']?: string
    ['data-widget-slot-path']?: string
    ['data-widget-root']?: bo
  }
}

// TODO 扩展 dataset 类型定义
// declare module 'dom' {
//   interface HTMLOrSVGElement {
//     readonly dataset: DOMStringMap & { widgetId: string }
//   }
// }
