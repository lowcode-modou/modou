import { FC, ReactElement } from 'react'
import { RecoilSync } from 'recoil-sync'
import { WIDGETS_ATOM_KEY, WIDGETS_ATOM_STORE_KEY } from '../store'
import { WidgetBaseProps } from '@modou/core'

interface RecoilWidgetsSyncProps {
  widgets: WidgetBaseProps[]
  onWidgetsChange: (value: WidgetBaseProps[]) => void

}

export const RecoilWidgetsSync: FC<{
  children: ReactElement
} & RecoilWidgetsSyncProps> = ({
  children,
  widgets,
  onWidgetsChange
}) => {
  return <RecoilSync
    storeKey={WIDGETS_ATOM_STORE_KEY}
    read={(itemKey) => {
      if (itemKey === WIDGETS_ATOM_KEY) {
        return widgets
      }
    }}
    write={({ diff }) => {
      for (const [key, value] of diff) {
        if (key === WIDGETS_ATOM_KEY) {
          onWidgetsChange(value as WidgetBaseProps[])
        }
      }
    }}>{children}</RecoilSync>
}
