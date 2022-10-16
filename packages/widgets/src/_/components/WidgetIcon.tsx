import { createFromIconfontCN } from '@ant-design/icons'
import { FC } from 'react'

// import { useExternal } from 'ahooks'

const SCRIPT_URL = '//at.alicdn.com/t/c/font_3686106_l347s5lpc9.js'
const Icon = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: SCRIPT_URL,
})

// TODO  换一种方式引进
export const WidgetIcon: FC<{ type: string }> = ({ type }) => {
  // useExternal(SCRIPT_URL, {
  //   js: {
  //     async: true
  //   }
  // })
  return <Icon type={`widget-icon-${type}`} />
  // return <svg
  //   aria-hidden='true'
  //   style={{
  //     width: '1em',
  //     height: '1em',
  //     verticalAlign: '-0.15em',
  //     fill: 'currentColor',
  //     overflow: 'hidden'
  //   }}>
  //   <use xlinkHref={`#widget-icon-${type}`}/>
  // </svg>
}
