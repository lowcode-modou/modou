import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from 'antd'

export const Page: FC = () => {
  const navigator = useNavigate()
  return <div>
    <div>我是Page页面</div>
    <Button type={'primary'} onClick={() => navigator('/apps')}>跳转到 APPS 页面</Button>
  </div>
}
