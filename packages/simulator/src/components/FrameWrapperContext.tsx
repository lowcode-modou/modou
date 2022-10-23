// import { useMutationObserver } from 'ahooks'
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
} from 'react'
import { DndContext } from 'react-dnd'
import { useFrame } from 'react-frame-component'

import { useFrameStyle } from '../hooks'

export const FrameWrapperContext = forwardRef<{
  document: Document
}>((_, ref) => {
  // Hook returns iframe's window and document instances from Frame context
  const { document, window: contextWindow } = useFrame()
  useImperativeHandle(ref, () => ({
    document: document as unknown as Document,
  }))
  useFrameStyle(document)

  // const { dragDropManager } = useContext(DndContext)
  // const backend = useMemo(
  //   () => dragDropManager?.getBackend(),
  //   [dragDropManager],
  // )
  //
  // console.log('backend', backend)

  // useWidgetElements(document)
  // useMutationObserver(
  //   () => {
  //     console.log('___useMutationObserver')
  //   },
  //   document?.body,
  //   {
  //     childList: true,
  //     subtree: true,
  //   },
  // )
  return null
})

FrameWrapperContext.displayName = 'FrameWrapperContext'
