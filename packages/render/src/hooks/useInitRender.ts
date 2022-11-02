import { useEffect } from 'react'

import { WidgetBaseProps } from '@modou/core'

import { ReactRenderHost } from '../utils'

export const useInitRender = ({
  setWidgets,
  setRootWidgetId,
}: {
  setWidgets: (widgets: WidgetBaseProps[]) => void
  setRootWidgetId: (widgetId: string) => void
}) => {
  useEffect(() => {
    if (!window.reactRenderHost) {
      window.reactRenderHost = new ReactRenderHost({
        updateWidgets: setWidgets,
        updateRootWidgetId: setRootWidgetId,
      })
    }
  }, [setRootWidgetId, setWidgets])
}
