import { Def } from 'tern'

import browser from '../constants/defs/browser.json'
import ecma from '../constants/defs/ecmascript.json'
import lodash from '../constants/defs/lodash.json'

export const DEFS: Def[] = [
  // @ts-expect-error 暂时不支持的类型
  ecma,
  browser,
  // GLOBAL_FUNCTIONS,
  // GLOBAL_DEFS,
  lodash,
]
