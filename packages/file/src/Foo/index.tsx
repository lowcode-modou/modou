import { effect } from '@vue/reactivity'
import { autorun } from 'mobx'
import React, { type FC } from 'react'

import { generateId } from '@modou/core'
import { AppFile } from '@modou/file/AppFile'
import { PageFile } from '@modou/file/PageFile'
import { WidgetFile } from '@modou/file/WidgetFile'
import { mock_metadata } from '@modou/file/mock'

const appFile = AppFile.create({
  name: 'App_Demo',
  version: '0.0.0',
  id: generateId(),
})

// const appFile = AppFile.formJSON(mock_metadata as any)
const widget1 = WidgetFile.create({
  name: '按钮_1',
  version: '0.0.0',
  id: generateId(),
  widgetName: '按钮_1',
  slots: {},
  props: {
    title: '提交',
  },
  widgetType: 'Button',
})
const widget2 = WidgetFile.create({
  name: '输入框_2',
  version: '0.0.0',
  id: generateId(),
  widgetName: '输入框_2',
  slots: {},
  props: {
    title: '提交',
  },
  widgetType: 'Input',
})
const page1 = PageFile.create({
  name: 'Page_Demo_1',
  version: '0.0.0',
  id: generateId(),
})
page1.widgets.push(widget1)
const page2 = PageFile.create({
  name: 'Page_Demo_2',
  version: '0.0.0',
  id: generateId(),
})
page2.widgets.push(widget2)
appFile.pages.push(page1, page2)
const test = () => {
  // console.log(JSON.stringify(appFile))
  // console.log(appFile)
  appFile.test.push(Math.random())
  // [0].meta.name = '撒阿萨' + Math.random()
}

autorun(() => {
  console.log('autorun', appFile.test[0])
})
// autorun(() => {
//   console.log('autorun', appFile.meta.name)
// })
// effect(() => {
//   console.log(appFile.pages[0]?.meta?.name)
// })
// effect(() => {
//   console.log(appFile.pages[0])
// })

const Foo: FC<{ title: string }> = (props) => (
  <div>
    <button onClick={test}>测试</button>
  </div>
)

export default Foo
