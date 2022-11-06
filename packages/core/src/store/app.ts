import { DefaultValue, atom } from 'recoil'

import { App } from '../types'
import { generateRecoilKey } from '../utils'
import { MOCK_APP } from './mock'

export const appAtom = atom<App>({
  key: generateRecoilKey('metadataAtom'),
  default: {
    id: '',
    name: '',
    pages: [],
    entities: [],
  },
  effects: [
    ({ setSelf, onSet }) => {
      const key = 'metadata'
      const savedValue = localStorage.getItem(key)
      if (savedValue != null) {
        setSelf(JSON.parse(savedValue))
      } else {
        setSelf(MOCK_APP)
      }

      onSet((newValue) => {
        if (newValue instanceof DefaultValue) {
          localStorage.removeItem(key)
        } else {
          localStorage.setItem(key, JSON.stringify(newValue))
        }
      })
    },
  ],
})
