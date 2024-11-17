import * as jotai from 'jotai'

declare global {
  interface Window {
    __md_jotai__: typeof jotai
  }
}
