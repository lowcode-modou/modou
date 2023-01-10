import * as mobx from 'mobx'

declare global {
  interface Window {
    __md_mobx__: typeof mobx
  }
}
