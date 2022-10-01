import { atom } from 'recoil'
import { generateRecoilKey } from '../utils'

export enum DropIndicatorPositionEnum {
  Top,
  Right,
  Bottom,
  Left
}
export enum DropIndicatorInsertPositionEnum {
  Before,
  After,
  Inner
}

export interface DropIndicator {
  position: DropIndicatorPositionEnum
  insertPosition: DropIndicatorInsertPositionEnum
  show: boolean
}

export const dropIndicatorAtom = atom<DropIndicator>({
  key: generateRecoilKey('dropIndicatorAtom'),
  default: {
    position: DropIndicatorPositionEnum.Left,
    insertPosition: DropIndicatorInsertPositionEnum.Inner,
    show: false
  }
})
