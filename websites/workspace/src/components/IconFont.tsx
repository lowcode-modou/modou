import { createFromIconfontCN } from '@ant-design/icons'
import { ComponentProps, FC } from 'react'

const SCRIPT_URL = '//at.alicdn.com/t/c/font_3642824_ry39fh7p15b.js'
const Icon = createFromIconfontCN({
  // 在 iconfont.cn 上生成
  scriptUrl: SCRIPT_URL,
})

export const IconFont: FC<ComponentProps<typeof Icon>> = ({ type }) => {
  return <Icon type={`icon-modou-${type}`} />
}
