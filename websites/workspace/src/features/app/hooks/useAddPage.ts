import produce from 'immer'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { Metadata, Page } from '@modou/core'

export const useAddPage = () => {
  const setPages = useSetRecoilState(Metadata.pagesSelector)
  const addPage = useCallback(
    (page: Page) => {
      setPages(
        produce((draft) => {
          draft.push(page)
        }),
      )
    },
    [setPages],
  )
  return { addPage }
}
