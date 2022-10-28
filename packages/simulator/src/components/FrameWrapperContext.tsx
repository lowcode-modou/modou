// import { useMutationObserver } from 'ahooks'
import { ConfigProvider } from 'antd'
import {
  ReactElement,
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react'
import { DndContext } from 'react-dnd'
import { useFrame } from 'react-frame-component'

import { DocumentContext } from '@modou/core'

import { useFrameStyle } from '../hooks'

export const FrameWrapperContext = forwardRef<
  {
    document: Document
  },
  { children: ReactElement }
>(({ children }, ref) => {
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

  const documentContextRef = useRef<{
    document: Document
    window: Window
  }>({
    document: document!,
    window: window!,
  })
  documentContextRef.current.document = document!
  documentContextRef.current.window = window!

  const isInit = document && window
  return isInit ? (
    <DocumentContext.Provider value={documentContextRef}>
      <ConfigProvider
        getPopupContainer={() =>
          documentContextRef.current.document?.body as unknown as HTMLElement
        }
        getTargetContainer={() =>
          documentContextRef.current.window as unknown as HTMLElement
        }
      >
        {children}
      </ConfigProvider>
    </DocumentContext.Provider>
  ) : null
})

FrameWrapperContext.displayName = 'FrameWrapperContext'
