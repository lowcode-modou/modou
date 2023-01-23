import {
  DeleteOutlined,
  HolderOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useMemoizedFn, useMount, useUpdate } from 'ahooks'
import { Button, Space, Table } from 'antd'
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
import { toJS } from '@modou/reactivity'
import { BaseSetterProps } from '@modou/setters'

import {
  ColumnAlignEnum,
  ColumnFixedEnum,
  ColumnValueTypeEnum,
} from '../../types'
import { ColumnSetting } from './ColumnSetting'
import { DraggableBodyRow } from './DraggableBodyRow'
import { TableWidgetColumn } from './types'

const CUSTOM_COLUMN_DATA_INDEX_PREFIX = 'custom_column_'
const CUSTOM_COLUMN_TITLE_PREFIX = '自定义列-'
const NORMAL_WIDTH = -1

// TODO 从 mr 生成默认值
const generateDefaultColumn = (
  columns: TableWidgetColumn[],
): TableWidgetColumn => {
  const customColumns = columns.filter((c) => !c.buildIn)
  const customColumnNumbers = customColumns.map(
    (c) => +c.dataIndex.replace(CUSTOM_COLUMN_DATA_INDEX_PREFIX, ''),
  )
  const maxCustomColumnNumber =
    customColumnNumbers.length === 0 ? 1 : Math.max(...customColumnNumbers) + 1
  return {
    dataIndex: `${CUSTOM_COLUMN_DATA_INDEX_PREFIX}${maxCustomColumnNumber}`,
    title: `${CUSTOM_COLUMN_TITLE_PREFIX}${maxCustomColumnNumber}`,
    valueType: ColumnValueTypeEnum.text,
    buildIn: false,
    align: ColumnAlignEnum.left,
    fixed: ColumnFixedEnum.false,
    width: NORMAL_WIDTH,
    mappedValue: '开始-{{Math.random()}}-结束',
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
        update(toJS(value), {
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
    onChange([...value, generateDefaultColumn(value)])
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
  const updateCurrentColumn = useMemoizedFn((newColumn: TableWidgetColumn) => {
    onChange(
      produce(toJS(value), (draft) => {
        draft[currentColumnIndex] = newColumn
      }),
    )
  })

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
