import { FC, useState } from 'react'
import { Button, Col, Divider, Image, Row, Space, Typography } from 'antd'
import { SelectSetter } from '@modou/setters'
import { ButtonWidget } from '@modou/widgets'
import { MoDouRender, testRender, widgetByIdAtom } from '@modou/render'
import { ButtonType } from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import { useRecoilState } from 'recoil'

const testMR = (): void => {
  console.log('永远相信美好的事情即将发生')
}

// TODO 测试
const schemaToDefaultJSON = (dsl: any) => {
  console.log(dsl)
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
  const navigator = useNavigate()

  const [buttonState, setButtonState] = useState<any>({ type: 'primary' })

  return <Row justify='center' align='middle' className='h-full'>
    <Col span={12}>
      <MoDouRender />
    </Col>
    <Col span={12} className='text-center'>
      <Image src='./modou.svg' className='w-36' />
      <Divider />
      <Typography.Title>PAGE 页面</Typography.Title>
      <Divider />
      <Space direction={'vertical'}>
        <Button block type='primary' onClick={testMR}>Test MR</Button>
        {/* <Button block type="primary" onClick={testMRToScheme}>Test MR to Scheme</Button> */}
        {/* <Button block type='primary' onClick={() => { */}
        {/*  // const defaultJson = */}
        {/*  schemaToDefaultJSON(widgetById) */}
        {/*  // setButtonState(defaultJson) */}
        {/* }}>Test Scheme to Default Json</Button> */}
        <Button block type='primary' onClick={() => {
          window.open('https://runtime.modou.ink', '_blank')
        }}>NAVIGATE TO WORKSPACE</Button>
        <Button block type={'primary'} onClick={() => navigator('/apps')}>跳转到 APPS 页面</Button>
      </Space>
      <Divider />
      <ButtonWidget title={'按钮 - ButtonWidget'} {...buttonState} />
      <Divider />
      <SelectSetter<ButtonType>
        value={buttonState.type}
        onChange={(type: any) => setButtonState({ type })}
        options={{ options }} />
    </Col>
  </Row>
}
