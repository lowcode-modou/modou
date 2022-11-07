import { Button, Col, List, Row, Space, Typography } from 'antd'
import { FC } from 'react'
import { Handle, NodeProps, Position } from 'reactflow'

import { Entity, EntityField } from '@modou/core'
import { mcss, useTheme } from '@modou/css-in-js'

export const EntityNode: FC<NodeProps<Entity>> = ({ data }, isConnectable) => {
  const theme = useTheme()
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: theme.colorPrimary }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="a"
        style={{ top: 10, background: theme.colorPrimary }}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="b"
        style={{ bottom: 10, top: 'auto', background: theme.colorPrimary }}
        isConnectable={isConnectable}
      />
      <List<EntityField>
        style={{
          '--header-bg-color': theme.colorPrimary,
        }}
        header={<Typography.Text>{data.description}</Typography.Text>}
        footer={
          <Row>
            <Col span={12}>
              <Button block type="link">
                编辑
              </Button>
            </Col>
            <Col span={12}>
              <Button block type="text" danger>
                删除
              </Button>
            </Col>
          </Row>
        }
        size={'small'}
        bordered
        className={classes.wrapper}
        dataSource={data.fields}
        renderItem={(field) => (
          <List.Item key={field.id}>
            <Space size={'small'}>
              <Typography.Text>
                {field.description}({field.name})
              </Typography.Text>
              {field.required && (
                <Typography.Text type={'danger'}>*</Typography.Text>
              )}
            </Space>
            <Typography.Text>{field.type}</Typography.Text>
          </List.Item>
        )}
      />
    </>
  )
}

const classes = {
  wrapper: mcss`
		width: 300px;
		border-radius: 10px;
		background-color: white;
		overflow: hidden;

		.ant-list-header {
			background-color: var(--header-bg-color);

			.ant-typography {
				color: white;
			}
		}

		.ant-list-footer {
			padding: 0 !important;
      .ant-btn{
        border-radius: 0!important;
      }
		}
    .ant-list-items{
			.ant-typography {
				font-size: 12px;
			}
    }
  `,
}
