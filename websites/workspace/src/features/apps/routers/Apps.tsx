import { FC } from 'react'
import { Col, Layout, Row, Card, Avatar } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons'

export const Apps: FC = () => {
  return <Layout className="h-full">
    <Layout.Header className="bg-white border-gray-50 border-b-4">
      <Row align="middle" className="h-full">
        <Col>
          <img src="./modou.svg" className="h-10" alt="" />
        </Col>
      </Row>
    </Layout.Header>
    <Layout.Content className="bg-white">
      <Row gutter={[16, 16]} className="p-6 w-full">
        {Array(12).fill(1).map((v, index) => <Col
          className="flex justify-center"
          key={index}
          xs={{ span: 24 }}
          sm={{ span: 12 }}
          md={{ span: 8 }}
          lg={{ span: 6 }}
          xl={{ span: 4 }}
          xxl={{ span: 4 }}
          span={4}>
          <Card
            className="shadow-2xl"
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
              title="MoDou"
              description="This is MoDou app description"
            />
          </Card>
        </Col>)}
      </Row>
    </Layout.Content>
    {/* <Layout.Footer>©MoDou</Layout.Footer> */}
  </Layout>
}
