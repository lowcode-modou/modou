import { Form, FormInstance, Input, Modal } from 'antd'
import { FC } from 'react'

import { Entity } from '@modou/core'

export const EntityCreator: FC<{
  onOk: (entity: Entity) => void
  onCancel: () => void
  open: boolean
  mode: 'create' | 'edit'
  form: FormInstance<Entity>
}> = ({ onOk, onCancel, open, mode, form }) => {
  // useExternal(
  //   'https://cdn.jsdelivr.net/npm/pinyin-pro@3.11.0/dist/index.cjs.min.js',
  // )
  const handleSubmit = async () => {
    await form.validateFields()
    onOk(form.getFieldsValue())
    form.resetFields()
  }
  const title = mode === 'create' ? '创建数据模型' : '编辑数据模型'
  return (
    <>
      <Modal
        title={title}
        onCancel={() => {
          onCancel()
          form.resetFields()
        }}
        onOk={handleSubmit}
        open={open}
        destroyOnClose
      >
        <Form<Entity>
          form={form}
          labelCol={{
            style: {
              width: '50px',
            },
          }}
        >
          <Form.Item label="ID" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="名称"
            name="title"
            rules={[{ required: true, message: '请输入数据模型名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="标识"
            name="name"
            rules={[
              { required: true, message: '请输入数据模型标识' },
              {
                pattern: /^[a-zA-Z]\w+$/,
                message: '只能由英文、数字、下划线组成，且必须英文开头',
              },
            ]}
          >
            <Input disabled={mode === 'edit'} />
          </Form.Item>
          <Form.Item label="描述" name="description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
