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
import { mcss } from '@modou/css-in-js'

enum PageActionEnum {
  Delete = 'Delete',
  Copy = 'Copy',
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

  const renderListItem: ComponentProps<typeof List<Page>>['renderItem'] = (
    page,
  ) => (
    <List.Item
      className={classes.listItem}
      onClick={() => {
        navigate(
          generateRouterPath(ROUTER_PATH.PAGE, {
            appId,
            pageId: page.id,
          }),
        )
      }}
    >
      <div className={classes.listItemContent}>
        {page.id === pageId ? (
          <Typography.Link>{page.name}</Typography.Link>
        ) : (
          <Typography.Text>{page.name}</Typography.Text>
        )}
        <Dropdown
          trigger={['click']}
          key={page.id}
          overlay={
            <Menu
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
                  key: PageActionEnum.Copy,
                },
                {
                  label: <Typography.Text type="danger">删除</Typography.Text>,
                  key: PageActionEnum.Delete,
                },
              ]}
            />
          }
        >
          <MoreOutlined
            className={`${classes.moreAction} mm_p-list_item_more_action`}
          />
        </Dropdown>
      </div>
    </List.Item>
  )

  return (
    <>
      {itemAddRef &&
        createPortal(
          <ModalForm<Pick<Page, 'name'>>
            form={form}
            layout="horizontal"
            title="创建页面"
            modalProps={{
              mask: false,
            }}
            onFinish={async (formData) => {
              await form.validateFields()
              console.log(formData)
              addPage(AppFactory.generateDefaultPage(formData.name))
              form.resetFields()
              return true
            }}
            trigger={
              <Button type="text" shape="circle" size="small">
                <PlusOutlined />
              </Button>
            }
          >
            <ProFormText
              rules={[{ required: true, message: '请输入页面名称' }]}
              name="name"
              label="页面名称"
              placeholder="请输入页面名称"
            />
          </ModalForm>,
          itemAddRef,
        )}
      <List
        dataSource={dataSource}
        size="small"
        rowKey={'id'}
        renderItem={renderListItem}
      />
    </>
  )
}

const classes = {
  listItem: mcss`
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
    border: none !important;
    cursor: default;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      .mm_p-list_item_more_action {
        display: block !important;
      }
    }
  `,
  listItemContent: mcss`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    a {
      cursor: default !important;
    }
  `,
  moreAction: mcss`
    display: none;
  `,
}
