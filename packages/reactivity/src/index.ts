import * as _mobx from 'mobx'

const MD_MOBX_PATH = '__md_mobx__'

let mobx: typeof _mobx = _mobx

// TODO 判断浏览器环境还是Node环境
if (window.top && Reflect.has(window.top, MD_MOBX_PATH)) {
  mobx = Reflect.get(window.top, MD_MOBX_PATH)
}
Reflect.set(window, MD_MOBX_PATH, mobx)

export const action = mobx.action
export const autorun = mobx.autorun
export const computed = mobx.computed
export const comparer = mobx.comparer
export const configure = mobx.configure
export const get = mobx.get
export const makeAutoObservable = mobx.makeAutoObservable
export const makeObservable = mobx.makeObservable
export const observable = mobx.observable
export const observe = mobx.observe
export const reaction = mobx.reaction
export const remove = mobx.remove
export const runInAction = mobx.runInAction
export const set = mobx.set
export const toJS = mobx.toJS
export const trace = mobx.trace
export const untracked = mobx.untracked
export const Reaction = mobx.Reaction
export const when = mobx.when
export const getDependencyTree = mobx.getDependencyTree

export {
  type IReactionDisposer,
  type AnnotationsMap,
  Reaction as ReactionType,
} from 'mobx'
