import produce from 'immer'
import { useCallback } from 'react'
import { useSetRecoilState } from 'recoil'

import { Metadata } from '@modou/core'

export const useRemovePage = () => {
  const setPageById = useSetRecoilState(Metadata.pageByIdSelector)
  const removePage = useCallback(
    (pageId: string) => {
      setPageById(
        produce((draft) => {
          Reflect.deleteProperty(draft, pageId)
        }),
      )
    },
    [setPageById],
  )
  return { removePage }
}
