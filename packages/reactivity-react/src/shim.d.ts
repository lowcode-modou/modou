import * as mobxReactLite from 'mobx-react-lite'

declare global {
  interface Window {
    __md_mobx_react_lite__: typeof mobxReactLite
  }
}
