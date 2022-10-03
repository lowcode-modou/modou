import { customAlphabet } from 'nanoid'
import { name } from '../../package.json'

const nanoid = customAlphabet('abcdefghigklmnopqrstuvwxyz', 12)
export const generateId = (size: number = 12): string => {
  return nanoid(size)
}
export const generateRecoilKey = (key: string, packageName: string = name): string => {
  return `@${packageName}/${key}`
}
