import { atom } from 'recoil'
import { generateRecoilKey } from '../utils'

export enum DropIndicatorPositionEnum {
  Before,
  After
}
export const dropIndicatorAtom = atom<{
  position: DropIndicatorPositionEnum
  show: boolean
}>({
  key: generateRecoilKey('dropIndicatorAtom'),
  default: {
    position: DropIndicatorPositionEnum.Before,
    show: false
  }
})
