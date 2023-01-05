import { Spin } from 'antd'
import {
  FC,
  ReactElement,
  RefObject,
  cloneElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useRecoilValue } from 'recoil'

import { mcss } from '@modou/css-in-js'

import { SimulatorInstanceContext } from '../contexts'
import { pageSelector } from '../store'
import { CanvasDesignerKeyPress } from './CanvasDesignerKeyPress'
import { DesignerIndicator } from './DesignerIndicator'

export const CanvasDesignerCanvas: FC<{
  children: ReactElement
}> = ({ children }) => {
  const { widgets, rootWidgetId } = useRecoilValue(pageSelector)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [initializedIframe, setInitializedIframe] = useState(false)

  useEffect(() => {
    if (!initializedIframe) {
      return
    }
    iframeRef.current?.contentWindow?.reactRenderHost.updateWidgets(widgets)
    iframeRef.current?.contentWindow?.reactRenderHost.updateRootWidgetId(
      rootWidgetId,
    )
  }, [widgets, rootWidgetId, initializedIframe])
  const canvasRef = useRef<HTMLElement>(null)

  const [designerIndicatorStyle, setDesignerIndicatorStyle] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })

  const onLoad = useCallback(() => {
    setTimeout(() => {
      const iframeEl = iframeRef.current!
      // @ts-expect-error
      canvasRef.current = iframeEl.contentWindow?.document
      const iframeRect = iframeEl.getClientRects()[0]
      setDesignerIndicatorStyle({
        top: iframeRect.top,
        right: iframeRect.right,
        bottom: iframeRect.bottom,
        left: iframeRect.left,
      })
      setInitializedIframe(true)
    })
  }, [])
  return (
    <div className={classes.wrapper}>
      {cloneElement<{ ref: RefObject<HTMLIFrameElement>; onLoad: () => void }>(
        children,
        {
          ref: iframeRef,
          onLoad,
        },
      )}
      {initializedIframe && (
        <>
          <SimulatorInstanceContext.Provider
            value={{ document: iframeRef.current?.contentWindow?.document }}
          >
            <DesignerIndicator
              canvasRef={canvasRef}
              style={designerIndicatorStyle}
            />
            <CanvasDesignerKeyPress />
          </SimulatorInstanceContext.Provider>
        </>
      )}
      {!initializedIframe && (
        <div className={classes.spinWrapper}>
          <Spin size="large" />
        </div>
      )}
    </div>
  )
}

const classes = {
  wrapper: mcss`
    position: relative;
    padding: 16px;
    height: 100%;
  `,
  spinWrapper: mcss`
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
}
