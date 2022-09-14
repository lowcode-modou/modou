import { FC } from 'react'
import { Button } from 'antd'
import { ButtonType } from 'antd/es/button'

// props
// state
// readonly extra定义
// event 传递deep position

export const ButtonWidget: FC<{ type: ButtonType }> = ({ type }) => {
  return <Button type={type}>我是按钮</Button>
}
