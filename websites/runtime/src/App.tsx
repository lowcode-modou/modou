import { Divider, Image, Typography } from 'antd'
import { FC } from 'react'

import './App.css'

const App: FC = () => {
  return (
    <div className="modou">
      <Image src="./modou.svg" alt="" style={{ width: '30vw' }} />
      <Divider />
      <Typography.Title className="tracking-wide" type={'danger'}>
        永远相信美好的事情即将发生
      </Typography.Title>
      <Divider />
      <Typography.Link
        onClick={() => {
          window.open('https://workspace.modou.ink', '_blank')
        }}
      >
        NAVIGATE TO WORKSPACE
      </Typography.Link>
    </div>
  )
}

export default App
