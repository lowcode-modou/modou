import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

export const Apps: FC = () => {
  const navigator = useNavigate()
  return <div>
    <div>我是Apps页面</div>
    <button onClick={() => navigator('/page')}>跳转到 PAGE 页面</button>
  </div>
}
