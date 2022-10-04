import { createFromIconfontCN } from '@ant-design/icons'
import { FC } from 'react'

const SCRIPT_URL = '//at.alicdn.com/t/c/font_3686106_l347s5lpc9.js'
const Icon = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: SCRIPT_URL,
  extraCommonProps: {
    prefix: 'widget-icon'
  }
})

export const WidgetIcon: FC<{ type: string }> = ({ type }) => {
  return <Icon type={`widget-icon-${type}`}/>
}
