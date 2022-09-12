import { FC } from 'react'
import { Spin } from 'antd'

export const AppSpin: FC = () => {
  return <div className="h-full w-full">
    <Spin size={'large'} />
  </div>
}
