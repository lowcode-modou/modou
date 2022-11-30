import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components'
import { Button, SelectProps } from 'antd'
import produce from 'immer'
import { ComponentProps, FC, ReactNode } from 'react'
import { useSetRecoilState } from 'recoil'

import {
  EntityField, // 不要直接使用  需要注册后使用
  EntityFieldEnum,
  Metadata,
  generateId,
  getEntityFieldTypeLabel,
} from '@modou/core'

const buildEntityFieldConfig = (
  entityFieldType: EntityFieldEnum,
): ReactNode => {
  switch (entityFieldType) {
    case EntityFieldEnum.Text:
    case EntityFieldEnum.LongText:
      return (
        <>
          <ProFormDigit
            name={['config', 'max']}
            label="最大长度"
            max={255}
            fieldProps={{ precision: 0 }}
          />
          <ProFormDigit
            name={['config', 'min']}
            label="最小长度"
            min={0}
            fieldProps={{ precision: 0 }}
          />
        </>
      )
    case EntityFieldEnum.Enum:
      return (
        <>
          <ProFormSelect
            name={['config', 'enumCode']}
            label="枚举类型"
            placeholder="请选择枚举类型"
            options={EntityFieldRadioOptions}
            allowClear={false}
            rules={[
              {
                required: true,
                message: '请选择枚举类型',
              },
            ]}
          />
          <ProFormSwitch name={['config', 'multiple']} label="多选" />
        </>
      )
    case EntityFieldEnum.Number:
      return (
        <>
          <ProFormDigit
            name={['config', 'max']}
            label="最大值"
            max={255}
            fieldProps={{ precision: 0 }}
          />
          <ProFormDigit
            name={['config', 'min']}
            label="最小值"
            min={0}
            fieldProps={{ precision: 0 }}
          />
          <ProFormDigit
            name={['config', 'precision']}
            label="小数位数"
            min={0}
            fieldProps={{ precision: 0 }}
          />
        </>
      )
    case EntityFieldEnum.AutoNumber:
      return (
        <>
          <ProFormText
            name={['config', 'format']}
            label="显示格式"
            placeholder="请输入显示格式"
          />
        </>
      )
    case EntityFieldEnum.Image:
      return (
        <>
          <ProFormSwitch name={['config', 'multiple']} label="多选" />
        </>
      )
    case EntityFieldEnum.PhoneNumber:
    case EntityFieldEnum.URL:
    case EntityFieldEnum.Email:
    case EntityFieldEnum.Date:
    case EntityFieldEnum.DateTime:
    default:
      return null
  }
}

const EntityFieldRadioOptions: SelectProps['options'] = Object.values(
  EntityFieldEnum,
).map((fieldType) => ({
  label: getEntityFieldTypeLabel(fieldType),
  value: fieldType,
}))
export const EntityFieldCreator: FC<{
  trigger: ComponentProps<typeof DrawerForm>['trigger']
  entityId: string
}> = ({ trigger, entityId }) => {
  const [form] = ProForm.useForm<EntityField>()
  const fieldType = ProForm.useWatch<EntityFieldEnum>('type', form)

  const setEntity = useSetRecoilState(Metadata.entitySelector(entityId))

  return (
    <DrawerForm<EntityField>
      title="新建字段"
      width={500}
      form={form}
      size={'small'}
      layout={'horizontal'}
      labelCol={{
        style: {
          width: '80px',
        },
      }}
      drawerProps={{
        destroyOnClose: true,
      }}
      onFinish={async (formData) => {
        setEntity(
          produce((draft) => {
            draft.fields.push({
              ...formData,
              id: generateId(),
            })
          }),
        )
        return true
      }}
      trigger={trigger}
    >
      <ProFormSelect
        name="type"
        label="字段类型"
        placeholder="请选择字段类型"
        options={EntityFieldRadioOptions}
        allowClear={false}
        rules={[
          {
            required: true,
            message: '请选择字段类型',
          },
        ]}
      />
      <ProFormText
        name="title"
        label="字段名称"
        placeholder="请输入字段类型"
        rules={[
          {
            required: true,
            message: '请输入字段名称',
          },
        ]}
      />
      <ProFormText
        name="name"
        label="字段标识"
        placeholder="请输入字段标识"
        rules={[
          {
            required: true,
            message: '请输入字段标识',
          },
        ]}
      />
      <ProFormText
        name="description"
        label="字段描述"
        placeholder="请输入字段描述"
      />
      {fieldType !== EntityFieldEnum.AutoNumber && (
        <ProFormSwitch name="required" label="必填" />
      )}
      {buildEntityFieldConfig(fieldType)}
    </DrawerForm>
  )
}
