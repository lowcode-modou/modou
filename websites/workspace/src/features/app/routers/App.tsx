import { FC } from 'react'
import { Col, Layout, Row, Avatar, Button } from 'antd'
import { Outlet } from 'react-router-dom'

export const App: FC = () => {
  return <Layout className="h-full">
    <Layout.Header
      style={{
        height: '48px',
        lineHeight: '48px',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
      className="bg-white border-gray-100 border-solid border-0 border-b-2">
      <Row className="h-full">
        <Col span={12} className="flex items-center">
          <img
            style={{
              height: '32px'
            }}
            src="/modou.svg" alt="" />
          <Row className='pl-4 pr-4'>
            <Button.Group size='small'>
              <Button type="link" ghost>数据模型</Button>
              <Button type="link" ghost>页面</Button>
            </Button.Group>
          </Row>
        </Col>
        <Col span={12} className="flex justify-end items-center">
          <Button type='link' href="https://runtime.modou.ink" target='_blank'>预览</Button>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
        </Col>
      </Row>
    </Layout.Header>
    <Layout>
      <Layout.Content>
        <Outlet/>
      </Layout.Content>
    </Layout>
  </Layout>
}
