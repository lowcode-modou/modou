import { FC, ReactElement, useState } from 'react'
import { RecoilSync } from 'recoil-sync'
import { PAGE_ATOM_KEY, PAGE_ATOM_KEY_STORE_KEY, pageAtom, selectedWidgetIdAtom } from '../store'
import { Page } from '@modou/core'
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil'

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
      console.log(page.id, tempPageId)
      if (page.id !== tempPageId) {
        setSelectWidgetId('')
        setTempPageId(page.id)
      }
      updateItem(PAGE_ATOM_KEY, page)
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
