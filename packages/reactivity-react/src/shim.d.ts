import * as mobxReactLite from 'mobx-react-lite'
import * as React from 'react'

declare global {
  interface Window {
    __md_mobx_react_lite__: typeof mobxReactLite
    React: typeof React
  }
}
