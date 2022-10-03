import { FC } from 'react'
import { useRecoilValue } from 'recoil'
import { Metadata } from '@modou/core'
import { Button, Dropdown, List, Menu, Typography } from 'antd'
import { MoreOutlined, PlusOutlined } from '@ant-design/icons'
import { createPortal } from 'react-dom'
export const ModuleManagerPage: FC<{
  searchVal: string
  itemAddRef: HTMLElement | null
}> = ({ searchVal, itemAddRef }) => {
  const pages = useRecoilValue(Metadata.pagesSelector)
  const dataSource = pages.filter((page) => {
    return page.name.includes(searchVal)
  })
  return <>
     {/* {itemAddRef && createPortal(<ModalForm */}
     {/* trigger={<Button type='text' shape="circle" size='small'><PlusOutlined/></Button>} */}
     {/* />, itemAddRef)} */}
    <List
      dataSource={dataSource}
      size='small'
      rowKey={'id'}
      renderItem={page => <List.Item
        style={{
          marginLeft: '-16px',
          marginRight: '-16px',
          paddingLeft: '16px',
          paddingRight: '16px'
        }}
        className="!border-none cursor-default hover:bg-gray-200 group"
      >
        <div className='flex justify-between items-center w-full'>
          <Typography.Text>{page.name}</Typography.Text>
          <Dropdown trigger={['click']} key={page.id} overlay={<Menu items={[
            {
              label: <Typography.Text>复制</Typography.Text>,
              key: 'copy'
            },
            {
              label: <Typography.Text type='danger'>删除</Typography.Text>,
              key: 'delete'
            }
          ]}/>}>
            <MoreOutlined className='hidden group-hover:block' />
          </Dropdown>
        </div>
      </List.Item>} />
  </>
}
