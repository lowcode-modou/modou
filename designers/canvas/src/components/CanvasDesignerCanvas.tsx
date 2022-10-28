import { useBoolean } from 'ahooks'
import { Tooltip } from 'antd'
import { FC, useRef } from 'react'
import { useRecoilValue } from 'recoil'

import { ReactRender } from '@modou/render'
import { SimulatorPC } from '@modou/simulator'

import { SimulatorInstanceContext } from '../contexts'
import { pageSelector } from '../store'
import { CanvasDesignerKeyPress } from './CanvasDesignerKeyPress'
import { DesignerIndicator } from './DesignerIndicator'

export const CanvasDesignerCanvas: FC = () => {
  const { widgets, rootWidgetId } = useRecoilValue(pageSelector)
  const simulatorRef = useRef<{
    document: Document
  }>(null)
  const [isMount, { setTrue }] = useBoolean(false)
  return (
    <>
      <SimulatorPC
        ref={simulatorRef}
        contentDidMount={() => {
          setTrue()
        }}
      >
        <>
          <ReactRender rootWidgetId={rootWidgetId} widgets={widgets} />
          {isMount && (
            <>
              <SimulatorInstanceContext.Provider
                value={{ document: simulatorRef?.current?.document }}
              >
                <DesignerIndicator
                  canvasRef={simulatorRef?.current?.document as any}
                />
              </SimulatorInstanceContext.Provider>
              <CanvasDesignerKeyPress />
            </>
          )}
        </>
      </SimulatorPC>
    </>
  )
}

// const classes = {
//   wrapper: mcss`
//     height: 100vh;
//     position: relative;
//     padding: 16px;
//   `,
// }
