import { FC, useEffect, useState } from 'react'
import { Button, Col, Divider, Image, Row, Space, Typography } from 'antd'
import { SelectSetter } from '@modou/setters'
import { ButtonType } from 'antd/es/button'
import { useNavigate } from 'react-router-dom'
import { CanvasDesigner } from '@modou/canvas-designer'
import { useRecoilState } from 'recoil'
import { Metadata } from '@modou/core'
import produce from 'immer'
import { MOCK_PAGE_ID, MOCK_ROOT_WIDGET_ID, MOCK_WIDGETS } from '@/features/page/mock'

const testMR = (): void => {
  console.log('永远相信美好的事情即将发生')
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
  const [pageById, setPageById] = useRecoilState(Metadata.pageByIdSelector)
  const page = pageById[MOCK_PAGE_ID]

  useEffect(() => {
    if (page) {
      return
    }
    setPageById(produce(draft => {
      draft[MOCK_PAGE_ID] = {
        name: 'demo page',
        id: MOCK_PAGE_ID,
        widgets: MOCK_WIDGETS,
        rootWidgetId: MOCK_ROOT_WIDGET_ID
      }
    }))
  }, [page, setPageById])

  return <Row justify='center' align='middle' className='h-full'>
    <Col span={18} className='border-2 border-solid border-red-500 h-full'>
      {
        page && <CanvasDesigner
              rootWidgetId={page.rootWidgetId}
              widgets={page?.widgets || []}
              onWidgetsChange={(val) => {
                // console.log(val)
                setPageById(produce(draft => {
                  draft[MOCK_PAGE_ID].widgets = val
                }))
              }} />
      }
    </Col>
    <Col span={6} className='text-center'>
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
        }}>NAVIGATE TO RUNTIME</Button>
        <Button block type={'primary'} onClick={() => navigator('/apps')}>跳转到 APPS 页面</Button>
      </Space>
      <Divider />
      {/* <ButtonWidget title={'按钮 - ButtonWidget'} {...buttonState} /> */}
      <Divider />
      <SelectSetter<ButtonType>
        value={buttonState.type}
        onChange={(type: any) => setButtonState({ type })}
        options={{ options }} />
    </Col>
  </Row>
}
