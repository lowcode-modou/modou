import { ReactElement, forwardRef, useImperativeHandle, useRef } from 'react'
import Frame from 'react-frame-component'

import { mcss } from '@modou/css-in-js'

import pkg from '../../package.json'
// import { FrameBindingContext } from './FrameBindingContext'
import { FrameWrapperContext } from './FrameWrapperContext'

const INITIAL_CONTENT = `
<!DOCTYPE html>
<html lang='zh' style='height: 100vh'>
  <head>
    <title>${pkg.name}@${pkg.version}</title>
  </head>
  <body style='height: 100vh;padding: 16px;box-sizing: border-box'></body>
</html>`

interface SimulatorPCProps {
  children: ReactElement
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
        {/* <FrameBindingContext>{children}</FrameBindingContext> */}
        <div className={classes.wrapper}>
          <FrameWrapperContext ref={frameWrapperContextRef}>
            {children}
          </FrameWrapperContext>
        </div>
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
  wrapper: mcss`
    height: 100%;
    width: 100%;
  `,
}
