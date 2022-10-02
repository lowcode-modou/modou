import { FC } from 'react'
import { Col, Layout, Row, Card, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const AppsHeader: FC = () => {
  return <Layout.Header className="bg-white border-gray-100 border-solid border-0 border-b-2">
    <Row align="middle" className="h-full">
      <Col>
        <img src="/modou.svg" className="h-10" alt="" />
      </Col>
    </Row>
  </Layout.Header>
}

const AppsContent: FC = () => {
  const navigator = useNavigate()
  return <Layout.Content className="bg-white w-full">
    <Row gutter={[0, 0]}>
      {Array(13).fill(1).map((v, index) => <Col
        className="flex justify-center p-2"
        key={index}
        xs={{ span: 24 }}
        sm={{ span: 12 }}
        md={{ span: 8 }}
        lg={{ span: 6 }}
        xl={{ span: 4 }}
        xxl={{ span: 4 }}
        span={4}>
        <Card
          onClick={() => navigator('/page')}
          className="shadow-2xl m-1 w-full"
          // cover={
          //   <img src="./modou.svg" alt="" />
          //
          // }
          actions={[
            <SettingOutlined key="setting" />,
            <EditOutlined key="edit" />,
            <EllipsisOutlined key="ellipsis" />
          ]}
        >
          <Card.Meta
            avatar={<Avatar shape="square" src={`https://joeschmoe.io/api/v1/random?${index}`} />}
            title="APP NAME"
            description="我是 APP 描述"
          />
        </Card>
      </Col>)}
    </Row>
  </Layout.Content>
}

export const Apps: FC = () => {
  return <Layout className="h-full">
    <AppsHeader />
    <AppsContent />
    {/* <Layout.Footer>©MoDou</Layout.Footer> */}
  </Layout>
}
