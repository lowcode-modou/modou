import { ComponentProps, FC } from 'react'
import { useRecoilValue } from 'recoil'
import { AppFactory, Metadata, Page } from '@modou/core'
import { Button, Dropdown, Form, List, Menu, Typography } from 'antd'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { createPortal } from 'react-dom'
import { useAddPage, useRemovePage } from '../hooks'
import { useNavigate, useParams } from 'react-router-dom'
import { PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { ROUTER_PATH } from '@/constants'

enum PageActionEnum {
  Delete = 'Delete',
  Copy = 'Copy'
}

export const ModuleManagerPage: FC<{
  searchVal: string
  itemAddRef: HTMLElement | null
}> = ({ searchVal, itemAddRef }) => {
  const { appId, pageId } = useParams<PageRouterParamsKey>()
  const navigate = useNavigate()
  const pages = useRecoilValue(Metadata.pagesSelector)
  const dataSource = pages.filter((page) => {
    return page.name.includes(searchVal)
  })
  const [form] = Form.useForm<Pick<Page, 'name'>>()

  const { addPage } = useAddPage()
  const { removePage } = useRemovePage()

  const renderListItem: ComponentProps<typeof List<Page>>['renderItem'] = (page) => <List.Item
    style={{
      marginLeft: '-16px',
      marginRight: '-16px',
      paddingLeft: '16px',
      paddingRight: '16px'
    }}
    className='!border-none cursor-default hover:bg-gray-200 group'
    onClick={() => {
      navigate(generateRouterPath(ROUTER_PATH.PAGE, {
        appId,
        pageId: page.id
      }))
    }}
  >
    <div className='flex justify-between items-center w-full'>
      {
        page.id === pageId
          ? <Typography.Link className='!cursor-default'>{page.name}</Typography.Link>
          : <Typography.Text>{page.name}</Typography.Text>
      }
      <Dropdown
        trigger={['click']}
        key={page.id}
        overlay={<Menu
          onClick={({ key }) => {
            switch (key) {
              case PageActionEnum.Delete:
                removePage(page.id)
                break
              default:
            }
          }}
          items={[
            {
              label: <Typography.Text>复制</Typography.Text>,
              key: PageActionEnum.Copy
            },
            {
              label: <Typography.Text type='danger'>删除</Typography.Text>,
              key: PageActionEnum.Delete
            }
          ]} />}>
        <MoreOutlined className='hidden group-hover:block' />
      </Dropdown>
    </div>
  </List.Item>

  return <>
    {itemAddRef && createPortal(<ModalForm<Pick<Page, 'name'>>
      form={form}
      layout='horizontal'
      title='创建页面'
      modalProps={{
        mask: false
      }}
      onFinish={async formData => {
        await form.validateFields()
        console.log(formData)
        addPage(AppFactory.generateDefaultPage(formData.name))
        form.resetFields()
        return true
      }}
      trigger={<Button type='text' shape='circle' size='small'><PlusOutlined /></Button>}
    >
      <ProFormText
        rules={[{ required: true, message: '请输入页面名称' }]}
        name="name" label="页面名称" placeholder='请输入页面名称'/>
    </ModalForm>, itemAddRef)}
    <List
      dataSource={dataSource}
      size='small'
      rowKey={'id'}
      renderItem={renderListItem} />
  </>
}
