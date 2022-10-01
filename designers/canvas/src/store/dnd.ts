import { atom } from 'recoil'
import { generateRecoilKey } from '../utils'

export enum DropIndicatorPositionEnum {
  Top,
  Right,
  Bottom,
  Left
}
export const dropIndicatorAtom = atom<{
  position: DropIndicatorPositionEnum
  show: boolean
}>({
  key: generateRecoilKey('dropIndicatorAtom'),
  default: {
    position: DropIndicatorPositionEnum.Left,
    show: false
  }
})
