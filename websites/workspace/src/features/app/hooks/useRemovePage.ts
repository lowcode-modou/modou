import { Metadata } from '@modou/core'
import { useSetRecoilState } from 'recoil'
import produce from 'immer'
import { useCallback } from 'react'

export const useRemovePage = () => {
  const setPageById = useSetRecoilState(Metadata.pageByIdSelector)
  const removePage = useCallback((pageId: string) => {
    setPageById(produce(draft => {
      Reflect.deleteProperty(draft, pageId)
    }))
  }, [setPageById])
  return { removePage }
}
