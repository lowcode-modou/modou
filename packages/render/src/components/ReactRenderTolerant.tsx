import { Spin } from 'antd'
import { FC } from 'react'
import * as React from 'react'

import { mcss } from '@modou/css-in-js'
import { useAppManager } from '@modou/meta-vfs'
import { observer } from '@modou/reactivity-react'
import {
  DEFAULT_WIDGET_VARIABLES,
  WidgetVariablesProvider,
} from '@modou/state-manager'

import { useCanvasFile } from '../contexts'
import { MoDouRenderProps } from '../types'
import { WidgetVirtual } from './WidgetVirtual'

const _ReactRenderTolerant: FC<MoDouRenderProps> = ({ host = 'browser' }) => {
  const { canvasFile } = useCanvasFile()
  const { appManager } = useAppManager()
  // FIXME 判断当前所在环境 是否从props更新widgets  可以加一个 host
  const rootWidget = appManager.widgetMap[canvasFile.meta.rootWidgetId]
  return rootWidget ? (
    <WidgetVariablesProvider value={{ ...DEFAULT_WIDGET_VARIABLES }}>
      <WidgetVirtual widgetId={canvasFile.meta.rootWidgetId} />
    </WidgetVariablesProvider>
  ) : (
    <div className={classes.spinWrapper}>
      <Spin size={'large'} />
    </div>
  )
}
export const ReactRenderTolerant = observer(_ReactRenderTolerant)
const classes = {
  spinWrapper: mcss`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  `,
}
