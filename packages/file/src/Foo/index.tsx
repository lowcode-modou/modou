import { effect } from '@vue/reactivity'
import React, { type FC } from 'react'

import { generateId } from '@modou/core'
import { AppFile } from '@modou/file/AppFile'
import { PageFile } from '@modou/file/PageFile'

const appFile = AppFile.create({
  name: 'App_Demo',
  version: '0.0.0',
  id: generateId(),
})
const test = () => {
  const page = PageFile.create({
    name: 'Page_Demo',
    version: '0.0.0',
    id: generateId(),
  })
  appFile.fileMap.pages.push(page)
  appFile.pages[0].meta.name = Math.random() + 'asas'
  console.log(appFile)
}

effect(() => {
  console.log(appFile.pages[0]?.meta?.name)
})
effect(() => {
  console.log(appFile.pages[0])
})

const Foo: FC<{ title: string }> = (props) => (
  <div>
    <button onClick={test}>测试</button>
  </div>
)

export default Foo
