import { Spin } from 'antd'
import { FC } from 'react'

import { mcss } from '@modou/css-in-js'

export const AppSpin: FC = () => {
  return (
    <div className={classes.wrapper}>
      <Spin size={'large'} />
    </div>
  )
}

const classes = {
  wrapper: mcss`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}
