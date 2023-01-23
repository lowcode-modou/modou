export enum ColumnValueTypeEnum {
  password = 'password',
  money = 'money',
  textarea = 'textarea',
  date = 'date',
  dateTime = 'dateTime',
  dateWeek = 'dateWeek',
  dateMonth = 'dateMonth',
  dateQuarter = 'dateQuarter',
  dateYear = 'dateYear',
  dateRange = 'dateRange',
  dateTimeRange = 'dateTimeRange',
  time = 'time',
  timeRange = 'timeRange',
  text = 'text',
  select = 'select',
  treeSelect = 'treeSelect',
  checkbox = 'checkbox',
  rate = 'rate',
  radio = 'radio',
  radioButton = 'radioButton',
  progress = 'progress',
  percent = 'percent',
  digit = 'digit',
  second = 'second',
  avatar = 'avatar',
  code = 'code',
  switch = 'switch',
  fromNow = 'fromNow',
  image = 'image',
  jsonCode = 'jsonCode',
  color = 'color',
  cascader = 'cascader',
}
export const ColumnValueTypeLabelMap: Record<ColumnValueTypeEnum, string> = {
  password: '密码输入框',
  money: '金额输入框',
  textarea: '文本域',
  date: '日期',
  dateTime: '日期时间',
  dateWeek: '周',
  dateMonth: '月',
  dateQuarter: '季度输入',
  dateYear: '年份输入',
  dateRange: '日期区间',
  dateTimeRange: '日期时间区间',
  time: '时间',
  timeRange: '时间区间',
  text: '文本框',
  select: '下拉框',
  treeSelect: '树形下拉框',
  checkbox: '多选框',
  rate: '星级组件',
  radio: '单选框',
  radioButton: '按钮单选框',
  progress: '进度条',
  percent: '百分比组件',
  digit: '数字输入框',
  second: '秒格式化',
  avatar: '头像',
  code: '代码框',
  switch: '开关',
  fromNow: '相对于当前时间',
  image: '图片',
  jsonCode: '代码框，但是带了 json 格式化',
  color: '颜色选择器',
  cascader: '级联选择器',
}

export enum ColumnAlignEnum {
  left = 'left',
  center = 'center',
  right = 'right',
}

export enum ColumnFixedEnum {
  left = 'left',
  right = 'right',
  false = '',
}
