import * as _mobxReactLite from 'mobx-react-lite'
import * as React from 'react'

let mobxReactLite: typeof _mobxReactLite = _mobxReactLite

// TODO 判断浏览器环境还是Node环境
if (window.top?.__md_mobx_react_lite__) {
  mobxReactLite = window.top.__md_mobx_react_lite__
}
window.__md_mobx_react_lite__ = mobxReactLite

if (!window.React) {
  window.React = React
}

// export const observer = mobxReactLite.observer
// export const Observer = mobxReactLite.Observer
//
export { observer, Observer } from 'mobx-react-lite'
