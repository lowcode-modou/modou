import { injectGlobal } from '@modou/css-in-js'

import './reset-antd.css'

injectGlobal`
  #root,
  #simulator_pc_root{
    height: 100%;
  }
`
