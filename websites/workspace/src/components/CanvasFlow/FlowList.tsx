import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { ModalForm, ProFormText } from '@ant-design/pro-components'
import { Button, Dropdown, Form, List, Typography } from 'antd'
import { ComponentProps, Dispatch, FC, SetStateAction, useContext } from 'react'
import { useParams } from 'react-router-dom'

import { AppFactoryContext } from '@modou/asset-vfs'
import { FlowNodeMetadata } from '@modou/core'
import { mcss } from '@modou/css-in-js'
import { FlowNodeEnum } from '@modou/flow-nodes'
import { useAppManager } from '@modou/meta-vfs'
import { FlowFile, FlowFileMeta } from '@modou/meta-vfs/src/FlowFile'
import { FlowNodeFile } from '@modou/meta-vfs/src/FlowNodeFile'
import { Observer, observer } from '@modou/reactivity-react'
import { generateId } from '@modou/shared'

import { PageRouterParamsKey } from '../../types'

enum FlowActionEnum {
  Delete = 'Delete',
  Copy = 'Copy',
}
const _FlowList: FC<{
  activeFlowId: string
  setActiveFlowId: Dispatch<SetStateAction<string>>
}> = ({ activeFlowId, setActiveFlowId }) => {
  const { appManager } = useAppManager()
  const { pageId } = useParams<PageRouterParamsKey>()
  const page = appManager.pageMap.get(pageId as string)!

  const [form] = Form.useForm<Pick<FlowFileMeta, 'name'>>()

  const renderListItem: ComponentProps<typeof List<FlowFile>>['renderItem'] = (
    flow,
  ) => (
    <Observer>
      {() => (
        <List.Item
          className={classes.listItem}
          onClick={() => {
            setActiveFlowId(flow.meta.id)
          }}
        >
          <div className={classes.listItemContent}>
            {flow.meta.id === activeFlowId ? (
              <Typography.Link>{flow.meta.name}</Typography.Link>
            ) : (
              <Typography.Text>{flow.meta.name}</Typography.Text>
            )}
            <Dropdown
              trigger={['hover']}
              key={flow.meta.id}
              menu={{
                onClick: ({ key }) => {
                  switch (key) {
                    case FlowActionEnum.Delete:
                      page.deleteFlow(flow.meta.id)
                      break
                    default:
                  }
                },
                items: [
                  {
                    label: <Typography.Text>复制</Typography.Text>,
                    key: FlowActionEnum.Copy,
                  },
                  {
                    label: (
                      <Typography.Text type="danger">删除</Typography.Text>
                    ),
                    key: FlowActionEnum.Delete,
                  },
                ],
              }}
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
  const appFactory = useContext(AppFactoryContext)

  return (
    <div className={classes.wrapper}>
      <div className={classes.createWrapper}>
        <ModalForm<Pick<FlowFileMeta, 'name'>>
          form={form}
          layout="horizontal"
          title="创建流"
          modalProps={{
            mask: false,
          }}
          onFinish={async (formData) => {
            await form.validateFields()
            const newFlow = FlowFile.create(
              {
                id: generateId(),
                name: formData.name,
              },
              page,
            )
            FlowNodeFile.create(
              {
                ...FlowNodeMetadata.mrSchemeToDefaultJson(
                  appFactory.flowNodeByType[FlowNodeEnum.START_NODE].metadata
                    .jsonPropsSchema,
                ),
                id: generateId(),
                position: {
                  x: 100,
                  y: 100,
                },
              },
              newFlow,
            )
            form.resetFields()
            return true
          }}
          trigger={
            <Button type="link" shape="circle" size="small">
              <PlusOutlined />
              <span>创建流</span>
            </Button>
          }
        >
          <ProFormText
            rules={[{ required: true, message: '请输入流名称' }]}
            name="name"
            label="流名称"
            placeholder="请输入流名称"
          />
        </ModalForm>
      </div>
      <div>
        <List
          dataSource={[...page.flows]}
          size="small"
          rowKey={(item) => item.meta.id}
          renderItem={renderListItem}
        />
      </div>
    </div>
  )
}
export const FlowList = observer(_FlowList)

const classes = {
  wrapper: mcss`
    width: 220px;
    border: 1px solid green;
    background-color: white;
    padding: 0 16px 16px;
  `,
  createWrapper: mcss`
    text-align: right;
  `,
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
