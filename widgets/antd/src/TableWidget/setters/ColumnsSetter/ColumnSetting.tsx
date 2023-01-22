import {
  LineOutlined,
  VerticalAlignBottomOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignTopOutlined,
} from '@ant-design/icons'
import { Card, Form, Input, Radio, Tooltip } from 'antd'
import produce from 'immer'
import { FC, ReactElement } from 'react'

import { mcss, useTheme } from '@modou/css-in-js'
import { NumberSetter } from '@modou/setters'

import { ColumnAlignEnum } from '../../types'
import { TableWidgetColumn } from './types'

export const ColumnSetting: FC<{
  children: ReactElement
  value: TableWidgetColumn
  onChange: (value: TableWidgetColumn) => void
}> = ({ children, value, onChange }) => {
  const theme = useTheme()
  return (
    <Tooltip
      color="white"
      placement="left"
      trigger="click"
      destroyTooltipOnHide={true}
      overlayClassName={classes.tooltipOverlay}
      overlayInnerStyle={{ padding: 0 }}
      title={
        value ? (
          <Card
            title={<div className={classes.header}>{value.dataIndex}</div>}
            className={classes.wrapper}
            style={{ color: theme.colorText }}
          >
            <div className={classes.content}>
              <Form
                layout={'horizontal'}
                size="small"
                labelCol={{ span: 6 }}
                labelAlign="left"
                colon={false}
              >
                <Form.Item label="列标题">
                  <Input
                    value={value.title}
                    onChange={(e) =>
                      onChange(
                        produce(value, (draft) => {
                          draft.title = e.target.value
                        }),
                      )
                    }
                  />
                </Form.Item>
                <Form.Item label="对齐方式">
                  <Radio.Group
                    onChange={(e) =>
                      onChange(
                        produce(value, (draft) => {
                          draft.align = e.target.value
                        }),
                      )
                    }
                    value={value.align}
                  >
                    <Tooltip title="左对齐列">
                      <Radio.Button value={ColumnAlignEnum.left}>
                        <VerticalAlignTopOutlined
                          className={classes.rotate_90}
                        />
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="居中列">
                      <Radio.Button value={ColumnAlignEnum.center}>
                        <VerticalAlignMiddleOutlined
                          className={classes.rotate_90}
                        />
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="右对齐列">
                      <Radio.Button value={ColumnAlignEnum.right}>
                        <VerticalAlignBottomOutlined
                          className={classes.rotate_90}
                        />
                      </Radio.Button>
                    </Tooltip>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="固定方式">
                  <Radio.Group
                    onChange={(e) =>
                      onChange(
                        produce(value, (draft) => {
                          draft.fixed = e.target.value
                        }),
                      )
                    }
                    value={value.fixed}
                  >
                    <Tooltip title="列固定到左侧">
                      <Radio.Button value={ColumnAlignEnum.left}>
                        <VerticalAlignTopOutlined
                          className={classes.rotate_90}
                        />
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="不固定列">
                      <Radio.Button value={ColumnAlignEnum.center}>
                        <LineOutlined />
                      </Radio.Button>
                    </Tooltip>
                    <Tooltip title="列固定到右侧">
                      <Radio.Button value={ColumnAlignEnum.right}>
                        <VerticalAlignBottomOutlined
                          className={classes.rotate_90}
                        />
                      </Radio.Button>
                    </Tooltip>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="宽度">
                  <NumberSetter
                    value={value.width}
                    onChange={(v) =>
                      onChange(
                        produce(value, (draft) => {
                          draft.width = v
                        }),
                      )
                    }
                  />
                </Form.Item>
              </Form>
            </div>
          </Card>
        ) : null
      }
    >
      {children}
    </Tooltip>
  )
}

const classes = {
  tooltipOverlay: mcss`
    width: ${320 + 150}px;
    max-width: 1000px;
    padding-right: 150px;
  `,
  wrapper: mcss`
  `,

  header: mcss`
  `,
  content: mcss`
    .ant-form-item{
      margin-bottom: 12px;
    }
    .ant-radio-group{
      width: 100%;
      display: flex;
      .ant-radio-button-wrapper{
        flex: 1;
        text-align: center;
      }
    }
  `,
  rotate_90: mcss`
    transform: rotate(-90deg);
  `,
}
