import { FC } from 'react'

import { mcss } from '@modou/css-in-js'

export const FlowList: FC = () => {
  return <div className={classes.wrapper}>FlowList</div>
}

const classes = {
  wrapper: mcss`
    width: 220px;
    border: 1px solid green;
    background-color: white;
  `,
}
