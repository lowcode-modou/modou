import { FC, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
import { Button, Col, Divider, Image, Row, Space, Typography } from 'antd'
import { mr, mrToJsonScheme } from '@modou/refine'
import { SelectSetter } from '@modou/setters'
import { ButtonWidget } from '@modou/widgets'
import { ButtonType } from 'antd/es/button'

const r = mr.object({
  name: mr.string()
}).describe('12')
  ._extra({
    'x-name': '大声道'
  })

const testMR = (): void => {
  console.log(r)
}

const testMRToScheme = (): void => {
  console.log(mrToJsonScheme(r))
}

const options: Parameters<typeof SelectSetter>[0]['options']['options'] = [
  {
    value: 'primary',
    label: '主要'
  }, {
    value: 'link',
    label: '连接'
  }, {
    value: 'text',
    label: '文本'
  }]

export const Page: FC = () => {
  // const navigator = useNavigate()

  const [buttonType, setButtonType] = useState<ButtonType>('primary')

  return <Row justify="center" align="middle" className="h-full">
    <Col className="text-center">
      <Image src="./modou.svg" className="w-36" />
      <Divider />
      <Typography.Title>PAGE 页面</Typography.Title>
      <Divider />
        <Space direction={'vertical'}>
          <Button block type="primary" onClick={testMR}>Test MR</Button>
          <Button block type="primary" onClick={testMRToScheme}>Test MR to Scheme</Button>
          <Button block type="primary" onClick={() => {
            window.open('https://runtime.modou.ink', '_blank')
          }}>NAVIGATE TO WORKSPACE</Button>
        </Space>
      {/* <Button type={'primary'} onClick={() => navigator('/apps')}>跳转到 APPS 页面</Button> */}
      <Divider />
      <ButtonWidget type={buttonType} />
      <Divider />
      <SelectSetter<ButtonType>
        value={buttonType}
        onChange={setButtonType}
        options={{ options }} />
    </Col>
  </Row>
}
