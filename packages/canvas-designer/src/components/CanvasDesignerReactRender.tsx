import React, { FC, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import { observer } from '@modou/reactivity-react'

// import { ReactRender } from '@modou/render'

const AAAReactRender: FC = () => {
  useEffect(() => {
    console.log('12312')
  })
  useEffect(() => {
    console.log('12312')
  })
  return <div>ReactRender</div>
}

const SSSReactRender = observer(AAAReactRender)

export const CanvasDesignerReactRender: FC = observer(() => {
  return (
    <div>
      阿萨
      <SSSReactRender />
    </div>
  )
  // return (
  //   <DndProvider backend={HTML5Backend} context={window.parent}>
  //     <ReactRender host="simulator" />
  //   </DndProvider>
  // )
})
