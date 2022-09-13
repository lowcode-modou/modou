import { FC } from 'react'
import { Spin } from 'antd'

export const AppSpin: FC = () => {
  return <div className="h-full w-full flex justify-center items-center">
    <Spin size={'large'} />
  </div>
}
