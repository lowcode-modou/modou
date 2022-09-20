import { atom, RecoilState, selector } from 'recoil'
import { generateRecoilKey } from '../utils'
import { App, Page } from '../types'
import { keyBy } from 'lodash'
import { produce } from 'immer'

export const Metadata: {
  appAtom: RecoilState<App>
  pageByIdSelector: RecoilState<Record<string, Page>>
} = {
  appAtom: atom<App>({
    key: generateRecoilKey('metadataAtom'),
    default: {
      id: '',
      name: '',
      pages: []
    }
  }),
  pageByIdSelector: selector<Record<string, Page>>({
    key: generateRecoilKey('pagesSelector'),
    get: ({ get }) => keyBy(get(Metadata.appAtom).pages, 'id'),
    set: ({ set }, newValue) => {
      set(Metadata.appAtom, produce<App>(draft => {
        draft.pages = Object.values(newValue)
      }))
    }
  })
}
