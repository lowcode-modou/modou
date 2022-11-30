import {
  DrawerForm,
  ProForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-components'
import { SelectProps } from 'antd'
import produce from 'immer'
import {
  ForwardRefRenderFunction,
  ReactNode,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react'
import { useRecoilCallback, useSetRecoilState } from 'recoil'

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

interface EntityFieldCreatorInstance {
  create: (params: { entityId: string }) => void
  edit: (params: { entityId: string; fieldId: string }) => void
  showDetail: (params: { entityId: string; fieldId: string }) => void
}

const _EntityFieldCreator: ForwardRefRenderFunction<
  EntityFieldCreatorInstance,
  {}
> = (_, ref) => {
  const [form] = ProForm.useForm<EntityField>()
  const fieldType = ProForm.useWatch<EntityFieldEnum>('type', form)

  const [entityId, setEntityId] = useState('')
  const [entityFieldId, setEntityFieldId] = useState('')
  const [mode, setMode] = useState<'detail' | 'create' | 'edit'>('detail')

  const setEntity = useSetRecoilState(Metadata.entitySelector(entityId))

  const [open, setOpen] = useState(false)

  const getEntityField = useRecoilCallback(
    ({ snapshot }) =>
      ({ entityId, fieldId }: { entityId: string; fieldId: string }) => {
        return snapshot
          .getLoadable(Metadata.entitySelector(entityId))
          .getValue()
          .fields.find((field) => field.id === fieldId) as EntityField
      },
    [],
  )

  useImperativeHandle(
    ref,
    () => ({
      create: ({ entityId }) => {
        setEntityId(entityId)
        setEntityFieldId('')
        setMode('create')
        setOpen(true)
      },
      edit: ({ entityId, fieldId }) => {
        setEntityId(entityId)
        setEntityFieldId(fieldId)
        setMode('edit')
        form.setFieldsValue(getEntityField({ entityId, fieldId }))
        setOpen(true)
      },
      showDetail: ({ entityId, fieldId }) => {
        setEntityId(entityId)
        setEntityFieldId(fieldId)
        setMode('detail')
        form.setFieldsValue(getEntityField({ entityId, fieldId }))
        setOpen(true)
      },
    }),
    [form, getEntityField],
  )

  return (
    <DrawerForm<EntityField>
      readonly={mode === 'detail'}
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
      open={open}
      onOpenChange={setOpen}
      onFinish={async (formData) => {
        switch (mode) {
          case 'create':
            setEntity(
              produce((draft) => {
                draft.fields.push({
                  ...formData,
                  id: generateId(),
                })
              }),
            )
            break
          case 'edit':
            setEntity(
              produce((draft) => {
                draft.fields = draft.fields.map((field) => {
                  if (field.id === entityFieldId) {
                    return { ...formData }
                  }
                  return field
                })
              }),
            )
            break
          case 'detail':
          default:
        }
        return true
      }}
    >
      <ProFormText hidden name="id" label="字段id" />
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

export const EntityFieldCreator =
  forwardRef<EntityFieldCreatorInstance>(_EntityFieldCreator)
