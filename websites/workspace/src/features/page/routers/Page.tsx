import { FC } from 'react'
// import { useNavigate } from 'react-router-dom'
import { Button, Col, Row, Typography } from 'antd'
import { mr, mrToJsonScheme } from '@modou/refine'

const testRefine = (): void => {
  const r = mr.object({
    name: mr.string()
  }).describe('12')
    ._extra({
      'x-name': '大声道'
    })

  console.log(mrToJsonScheme(r))
}

export const Page: FC = () => {
  // const navigator = useNavigate()
  return <Row justify="center" align="middle" className="h-full">
    <Col className="text-center">
      <Typography.Title>我是Page页面</Typography.Title>
      <Button.Group>
        <Button type="primary" onClick={testRefine}>Test Refine</Button>
        <Button type="primary">Test Refine to Scheme</Button>
        <Button type="primary">Test Scheme to Refine</Button>
      </Button.Group>
      {/* <Button type={'primary'} onClick={() => navigator('/apps')}>跳转到 APPS 页面</Button> */}
    </Col>
  </Row>
}
