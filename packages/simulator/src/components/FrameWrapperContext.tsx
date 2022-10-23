// import { useMutationObserver } from 'ahooks'
import { forwardRef, useContext, useEffect, useImperativeHandle } from 'react'
import { DndContext } from 'react-dnd'
import { useFrame } from 'react-frame-component'

import { useFrameStyle } from '../hooks'

export const FrameWrapperContext = forwardRef<{
  document: Document
}>((_, ref) => {
  // Hook returns iframe's window and document instances from Frame context
  const { document, window } = useFrame()
  useImperativeHandle(ref, () => ({
    document: document as unknown as Document,
  }))
  useFrameStyle(document)

  const { dragDropManager } = useContext(DndContext)
  useEffect(() => {
    // @ts-expect-error
    dragDropManager?.getBackend()?.addEventListeners(window)
    return () => {
      // @ts-expect-error
      dragDropManager?.getBackend()?.removeEventListeners(window)
    }
  })
  return null
})

FrameWrapperContext.displayName = 'FrameWrapperContext'
