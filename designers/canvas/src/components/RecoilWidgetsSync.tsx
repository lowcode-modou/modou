import { FC, ReactElement, useState } from 'react'
import { RecoilSync } from 'recoil-sync'
import { PAGE_ATOM_KEY, PAGE_ATOM_KEY_STORE_KEY, PAGE_ATOM_STATUS, selectedWidgetIdAtom } from '../store'
import { Page } from '@modou/core'
import { useSetRecoilState } from 'recoil'

interface RecoilWidgetsSyncProps {
  page: Page
  onPageChange: (page: Page) => void
}

export const RecoilWidgetsSync: FC<{
  children: ReactElement
} & RecoilWidgetsSyncProps> = ({
  children,
  page,
  onPageChange
}) => {
  const setSelectWidgetId = useSetRecoilState(selectedWidgetIdAtom)
  const [tempPageId, setTempPageId] = useState('')
  return <RecoilSync
    storeKey={PAGE_ATOM_KEY_STORE_KEY}
    listen={({ updateItem }) => {
      if (page.id !== tempPageId) {
        setSelectWidgetId('')
        setTempPageId(page.id)
      }
      if (PAGE_ATOM_STATUS.canUpdate) {
        updateItem(PAGE_ATOM_KEY, page)
      }
      PAGE_ATOM_STATUS.canUpdate = true
    }}
    read={(itemKey) => {
      if (itemKey === PAGE_ATOM_KEY) {
        return page
      }
    }}
    write={({ diff }) => {
      for (const [key, value] of diff) {
        if (key === PAGE_ATOM_KEY) {
          onPageChange(value as Page)
        }
      }
    }}>{children}</RecoilSync>
}
