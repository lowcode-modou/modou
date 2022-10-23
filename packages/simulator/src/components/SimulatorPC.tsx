import { ReactNode, forwardRef, useImperativeHandle, useRef } from 'react'
import Frame from 'react-frame-component'

import { mcss } from '@modou/css-in-js'

import { FrameBindingContext } from './FrameBindingContext'
import { FrameWrapperContext } from './FrameWrapperContext'

const INITIAL_CONTENT = `
<!DOCTYPE html>
<html lang='zh'>
  <head>
    <title>Render</title>
  </head>
  <body style='padding: 16px'></body>
</html>`

interface SimulatorPCProps {
  children: ReactNode
  contentDidMount?: () => void
  contentDidUpdate?: () => void
}

interface SimulatorPCRef {
  document: Document
}

export const SimulatorPC = forwardRef<SimulatorPCRef, SimulatorPCProps>(
  ({ children, contentDidMount, contentDidUpdate }, ref) => {
    const frameWrapperContextRef = useRef<SimulatorPCRef>(null)

    useImperativeHandle(ref, () => ({
      get document() {
        return frameWrapperContextRef?.current?.document as unknown as Document
      },
    }))
    return (
      <Frame
        className={classes.iframe}
        initialContent={INITIAL_CONTENT}
        mountTarget="body"
        contentDidUpdate={contentDidUpdate}
        contentDidMount={contentDidMount}
      >
        <FrameBindingContext>{children}</FrameBindingContext>
        <FrameWrapperContext ref={frameWrapperContextRef} />
      </Frame>
    )
  },
)
SimulatorPC.displayName = 'SimulatorPC'

const classes = {
  iframe: mcss`
    height: 100%;
    width: 100%;
    border: none;
    display: block;
  `,
}
