import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Avatar, Card, Col, Layout, Row } from 'antd'
import { FC } from 'react'
import { useNavigate } from 'react-router-dom'

import { mcss } from '@modou/css-in-js'

const headerClasses = {
  header: mcss`
    background-color: white !important;
    z-index: 50;
    box-shadow: rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0) 0 0 0 0,
      rgba(0, 0, 0, 0.1) 0 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px;
    padding: 0!important;
    height: 48px!important;
  `,
  logoWrapper: mcss`
    height: 100%;
    width: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  logo: mcss`
    height: 32px;
  `,
}

const AppsHeader: FC = () => {
  return (
    <Layout.Header className={headerClasses.header}>
      <div className={headerClasses.logoWrapper}>
        <img src="/modou.svg" className={headerClasses.logo} alt="" />
      </div>
    </Layout.Header>
  )
}

const contentClasses = {
  content: mcss`
    background-color: white;
    width: 100%;
  `,
  cardWrapper: mcss`
    display: flex;
    justify-content: center;
    padding: 8px;
  `,
  card: mcss`
    width: 100%;
    margin: 4px;
    box-shadow: rgba(0, 0, 0, 0) 0 0 0 0, rgba(0, 0, 0, 0) 0 0 0 0,
      rgba(0, 0, 0, 0.25) 0 25px 50px -12px;
  `,
}

const AppsContent: FC = () => {
  const navigator = useNavigate()
  return (
    <Layout.Content className={contentClasses.content}>
      <Row gutter={[0, 0]}>
        {Array(13)
          .fill(1)
          .map((v, index) => (
            <Col
              className={contentClasses.cardWrapper}
              key={index}
              xs={{ span: 24 }}
              sm={{ span: 12 }}
              md={{ span: 8 }}
              lg={{ span: 6 }}
              xl={{ span: 4 }}
              xxl={{ span: 4 }}
              span={4}
            >
              <Card
                onClick={() => navigator('/app/appId')}
                className={contentClasses.card}
                // cover={
                //   <img src="./modou.svg" alt="" />
                //
                // }
                actions={[
                  <SettingOutlined key="setting" />,
                  <EditOutlined key="edit" />,
                  <EllipsisOutlined key="ellipsis" />,
                ]}
              >
                <Card.Meta
                  avatar={
                    <Avatar
                      shape="square"
                      src={`https://joeschmoe.io/api/v1/random?${index}`}
                    />
                  }
                  title="APP NAME"
                  description="我是 APP 描述"
                />
              </Card>
            </Col>
          ))}
      </Row>
    </Layout.Content>
  )
}

export const Apps: FC = () => {
  return (
    <Layout className={mcss({ width: '100%' })}>
      <AppsHeader />
      <AppsContent />
      {/* <Layout.Footer>©MoDou</Layout.Footer> */}
    </Layout>
  )
}
