import {
  DeleteOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  HolderOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useMemoizedFn, useMount, useUpdate } from 'ahooks'
import { Button, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import produce from 'immer'
import update from 'immutability-helper'
import { JSONSchema7 } from 'json-schema'
import { isBoolean } from 'lodash'
import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from 'quicktype-core'
import {
  FC,
  HTMLAttributes,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

import { mcss, useTheme } from '@modou/css-in-js'
import { BaseSetterProps } from '@modou/setters'

import { MOCK_TABLE_DATA } from '../../mock'
import { ColumnValueTypeEnum } from '../../types'
import { ColumnSetting } from './ColumnSetting'
import { DraggableBodyRow } from './DraggableBodyRow'
import { TableWidgetColumn } from './types'
import { generateBuildInColumn, generateDefaultColumn } from './utils'

async function quicktypeJSON(
  targetLanguage: string,
  typeName: string,
  jsonString: string,
) {
  const jsonInput = jsonInputForTargetLanguage(targetLanguage)

  // We could add multiple samples for the same desired
  // type, or many sources for other types. Here we're
  // just making one type from one piece of sample JSON.
  await jsonInput.addSource({
    name: typeName,
    samples: [jsonString],
  })

  const inputData = new InputData()
  inputData.addInput(jsonInput)

  return await quicktype({
    inputData,
    lang: targetLanguage,
  })
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
      produce(value, (draft) => {
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
      render: (_value, record, index) => (
        <>
          <ColumnSetting value={currentColumn} onChange={updateCurrentColumn}>
            <Button type={'link'} onClick={() => editColumn(index)}>
              <SettingOutlined />
            </Button>
          </ColumnSetting>
          {!record.buildIn && (
            <Button type={'text'} danger onClick={() => removeColumn(index)}>
              <DeleteOutlined />
            </Button>
          )}

          {record.buildIn && (
            <Button
              type={'text'}
              danger
              onClick={() => {
                onChange(
                  produce<TableWidgetColumn[]>(value, (draft) => {
                    draft[index].hideInTable = !draft[index].hideInTable
                  }),
                )
              }}
            >
              {record.hideInTable ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </Button>
          )}
        </>
      ),
    },
  ]

  const testQuickTypeTest = useMemoizedFn(async () => {
    const res = await quicktypeJSON(
      'JSON Schema',
      'Root',
      JSON.stringify(MOCK_TABLE_DATA.data),
    )
    const scheme: JSONSchema7 = JSON.parse(res.lines.join('\n'))

    const columns: TableWidgetColumn[] = []

    const schemeRoot: JSONSchema7 = scheme.definitions!
      .RootElement as unknown as JSONSchema7

    const usedDataIndex = value.map((v) => v.dataIndex)
    Object.entries(schemeRoot.properties!).forEach(([prop, scheme]) => {
      // format [date-time, uri]
      if (isBoolean(scheme)) {
        return
      }
      if (usedDataIndex.includes(prop)) {
        return
      }
      switch (scheme.type) {
        case 'string':
        case 'null': {
          if (scheme.format === 'date-time') {
            columns.push(
              generateBuildInColumn({
                dataIndex: prop,
                valueType: ColumnValueTypeEnum.dateTime,
              }),
            )
          } else {
            columns.push(
              generateBuildInColumn({
                dataIndex: prop,
                valueType: ColumnValueTypeEnum.text,
              }),
            )
          }
          break
        }
        case 'boolean':
          columns.push(
            generateBuildInColumn({
              dataIndex: prop,
              valueType: ColumnValueTypeEnum.checkbox,
            }),
          )
          break
        case 'integer':
          columns.push(
            generateBuildInColumn({
              dataIndex: prop,
              valueType: ColumnValueTypeEnum.digit,
            }),
          )
          break
        default:
      }
    })

    onChange([...value, ...columns])
  })

  return (
    <div
      ref={wrapperRef}
      className={classes.wrapper}
      style={{
        '--border-color': theme.colorPrimary,
      }}
    >
      <Button onClick={testQuickTypeTest}>QuickTypeTest</Button>

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
        className={classes.table}
        pagination={false}
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
  table: mcss`
    tr.drop-over-downward td {
      border-bottom: 2px dashed #1677ff !important;
    }
    tr.drop-over-upward td {
      border-top: 2px dashed #1677ff !important;
    }
  `,
}
