import { Avatar, Button, Layout } from 'antd'
import { FC } from 'react'

import { mcss } from '@modou/css-in-js'

export const AppHeader: FC = () => {
  return (
    <Layout.Header className={classes.header}>
      <div className={classes.headerLogoWrapper}>
        <img src="/modou.svg" alt="" />
      </div>
      <div className={classes.headerRight}>
        <Button type="link" href="https://runtime.modou.ink" target="_blank">
          预览
        </Button>
        <Avatar src="https://joeschmoe.io/api/v1/random" />
      </div>
    </Layout.Header>
  )
}

const classes = {
  header: mcss`
    height: 48px !important;
    line-height: 48px !important;
    padding: 0 !important;
    z-index: 999999 !important;
    background-color: white !important;
    box-shadow: rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0) 0 0 0 0,
      rgba(0, 0, 0, 0.1) 0 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  headerLogoWrapper: mcss`
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      height: 32px;
    }
  `,
  headerRight: mcss`
    padding-right: 16px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  `,
}
