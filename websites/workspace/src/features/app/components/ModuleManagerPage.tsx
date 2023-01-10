import { ROUTER_PATH } from '@/constants'
import { PageRouterParamsKey } from '@/types'
import { generateRouterPath } from '@/utils/router'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Button, Dropdown, Form, List, Typography } from 'antd'
import { ComponentProps, FC } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useParams } from 'react-router-dom'

import { AppFactory, Page, useAppManager } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { PageFile } from '@modou/meta-vfs'
import { Observer, observer } from '@modou/reactivity-react'

import { useAddPage, useRemovePage } from '../hooks'

enum PageActionEnum {
  Delete = 'Delete',
  Copy = 'Copy',
}

const _ModuleManagerPage: FC<{
  searchVal: string
  itemAddRef: HTMLElement | null
}> = ({ searchVal, itemAddRef }) => {
  const { appId, pageId } = useParams<PageRouterParamsKey>()
  const navigate = useNavigate()
  const pages = useAppManager().app.pages
  const dataSource = pages.filter((page) => {
    return page.meta.name.includes(searchVal)
  })
  const [form] = Form.useForm<Pick<Page, 'name'>>()

  const { addPage } = useAddPage()
  const { removePage } = useRemovePage()

  const renderListItem: ComponentProps<typeof List<PageFile>>['renderItem'] = (
    page,
  ) => (
    <Observer>
      {() => (
        <List.Item
          className={classes.listItem}
          onClick={() => {
            navigate(
              generateRouterPath(ROUTER_PATH.PAGE, {
                appId,
                pageId: page.meta.id,
              }),
            )
          }}
        >
          <div className={classes.listItemContent}>
            {page.meta.id === pageId ? (
              <Typography.Link>{page.meta.name}</Typography.Link>
            ) : (
              <Typography.Text>{page.meta.name}</Typography.Text>
            )}
            <Dropdown
              trigger={['hover']}
              key={page.meta.id}
              menu={{
                onClick: ({ key }) => {
                  switch (key) {
                    case PageActionEnum.Delete:
                      removePage(page.meta.id)
                      break
                    default:
                  }
                },
                items: [
                  {
                    label: <Typography.Text>复制</Typography.Text>,
                    key: PageActionEnum.Copy,
                  },
                  {
                    label: (
                      <Typography.Text type="danger">删除</Typography.Text>
                    ),
                    key: PageActionEnum.Delete,
                  },
                ],
              }}
              // menu={
              //   <Menu
              //     onClick={({ key }) => {
              //       switch (key) {
              //         case PageActionEnum.Delete:
              //           removePage(page.id)
              //           break
              //         default:
              //       }
              //     }}
              //     items={}
              //  />
              // }
            >
              <MoreOutlined
                className={`${classes.moreAction} mm_p-list_item_more_action`}
              />
            </Dropdown>
          </div>
        </List.Item>
      )}
    </Observer>
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
        rowKey={(item) => item.meta.id}
        renderItem={renderListItem}
      />
    </>
  )
}
export const ModuleManagerPage = observer(_ModuleManagerPage)

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
