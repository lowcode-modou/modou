import {
  DeleteOutlined,
  HolderOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useMount, useUpdate } from 'ahooks'
import { Button, Form, Space, Table, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import produce from 'immer'
import update from 'immutability-helper'
import {
  FC,
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { generateId } from '@modou/core'
import { mcss, useTheme } from '@modou/css-in-js'
import { BaseSetterProps } from '@modou/setters'

import { ColumnValueTypeEnum } from '../../types'
import { ColumnSetting } from './ColumnSetting'
import { DraggableBodyRow } from './DraggableBodyRow'
import { TableWidgetColumn } from './types'

const generateDefaultColumn = (): TableWidgetColumn => {
  return {
    dataIndex: generateId(4),
    title: '自定义列',
    valueType: ColumnValueTypeEnum.text,
    buildIn: false,
  }
}

export const ColumnsSetter: FC<BaseSetterProps<TableWidgetColumn[]>> = ({
  value = [],
  onChange,
}) => {
  const dataSource = useMemo(
    () =>
      value.map((v, index) => ({
        ...v,
        key: v.dataIndex || index,
      })),
    [value],
  )

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  }

  const moveRow = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragRow = value[dragIndex]
      onChange(
        update(value, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      )
    },
    [onChange, value],
  )
  const wrapperRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()

  const forceRender = useUpdate()
  useMount(() => {
    setTimeout(forceRender)
  })

  const operationWrapper =
    wrapperRef.current?.parentElement?.parentElement?.parentElement
      ?.previousElementSibling
  const [currentColumnIndex, setCurrentColumnIndex] = useState(0)

  const addColumn = () => {
    onChange([...value, generateDefaultColumn()])
    setCurrentColumnIndex(value.length)
  }
  const removeColumn = (index: number) => {
    onChange(
      produce(value, (draft) => {
        draft.splice(index, 1)
      }),
    )
  }

  const editColumn = (index: number) => {
    setCurrentColumnIndex(index)
  }

  const currentColumn = value[currentColumnIndex]
  const updateCurrentColumn = useCallback(
    (newColumn: TableWidgetColumn) => {
      onChange(
        produce(value, (draft) => {
          draft[currentColumnIndex] = newColumn
        }),
      )
    },
    [currentColumnIndex, onChange, value],
  )

  const columns: ColumnsType<TableWidgetColumn> = [
    {
      title: '列标题',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
      render: (value) => {
        return (
          <div
            style={{
              width: '100%',
              textAlign: 'left',
            }}
          >
            <Space size={'small'}>
              <HolderOutlined />
              {value}
            </Space>
          </div>
        )
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: (value, record, index) => (
        <>
          <ColumnSetting value={currentColumn} onChange={updateCurrentColumn}>
            <Button type={'link'} onClick={() => editColumn(index)}>
              <SettingOutlined />
            </Button>
          </ColumnSetting>
          <Button type={'text'} danger onClick={() => removeColumn(index)}>
            <DeleteOutlined />
          </Button>
        </>
      ),
    },
  ]

  return (
    <div
      ref={wrapperRef}
      className={classes.wrapper}
      style={{
        '--border-color': theme.colorPrimary,
      }}
    >
      {operationWrapper &&
        createPortal(
          <ColumnSetting value={currentColumn} onChange={updateCurrentColumn}>
            <Button type={'link'} size={'small'} onClick={addColumn}>
              添加一列
            </Button>
          </ColumnSetting>,
          operationWrapper,
        )}
      <Table<TableWidgetColumn>
        size={'small'}
        columns={columns}
        dataSource={dataSource}
        components={components}
        onRow={(_, index) => {
          const attr = {
            index,
            moveRow,
          }
          return attr as HTMLAttributes<any>
        }}
      />
    </div>
  )
}

const classes = {
  wrapper: mcss`
		.ant-table tr.drop-over-downward td {
			border-bottom: 2px dashed var(--border-color);
		}

		.ant-table tr.drop-over-upward td {
			border-top: 2px dashed var(--border-color);
		}
  `,
}
