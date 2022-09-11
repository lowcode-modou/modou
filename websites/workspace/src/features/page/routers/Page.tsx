import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

export const Page: FC = () => {
  const navigator = useNavigate()
  return <div>
    <div>我是Page页面</div>
    <button onClick={() => navigator('/apps')}>跳转到 APPS 页面</button>
  </div>
}
