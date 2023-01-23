import {
  ColumnAlignEnum,
  ColumnFixedEnum,
  ColumnValueTypeEnum,
} from '../../../types'
import { TableWidgetColumn } from '../types'

const CUSTOM_COLUMN_DATA_INDEX_PREFIX = 'custom_column_'
const CUSTOM_COLUMN_TITLE_PREFIX = '自定义列-'
const NORMAL_WIDTH = -1
// TODO 从 mr 生成默认值
export const generateDefaultColumn = (
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
    hideInTable: false,
  }
}
// TODO 从 mr 生成 默认值
export const generateBuildInColumn = ({
  dataIndex,
  valueType,
  title,
}: {
  dataIndex: string
  valueType: ColumnValueTypeEnum
  title?: string
}): TableWidgetColumn => {
  return {
    dataIndex,
    title: title ?? dataIndex,
    valueType,
    buildIn: true,
    align: ColumnAlignEnum.left,
    fixed: ColumnFixedEnum.false,
    width: NORMAL_WIDTH,
    mappedValue: null,
    hideInTable: false,
  }
}
