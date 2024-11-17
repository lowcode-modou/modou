import * as _jotai from 'jotai'
import { Store } from 'jotai'

const MD_JOTAI_PATH = '__md_jotai__'

let jotai: typeof _jotai = _jotai

// TODO 判断浏览器环境还是Node环境
if (window.top && Reflect.has(window.top, MD_JOTAI_PATH)) {
  jotai = Reflect.get(window.top, MD_JOTAI_PATH)
}
Reflect.set(window, MD_JOTAI_PATH, jotai)

export const atom = jotai.atom
export const useAtom = jotai.useAtom
export const useAtomValue = jotai.useAtomValue
export const useSetAtom = jotai.useSetAtom
export const createStore = jotai.createStore
export const getDefaultStore = jotai.getDefaultStore
export const useStore = jotai.useStore
export const Provider = jotai.Provider
export default jotai.default
export type * from 'jotai'
