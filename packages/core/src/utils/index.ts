import { customAlphabet } from 'nanoid'
import { name } from '../../package.json'

const nanoid = customAlphabet('abcdefghigklmnopqrstuvwxyz', 12)
export const generateId = (): string => {
  return nanoid(12)
}
export const generateRecoilKey = (key: string): string => {
  return `@${name}/${key}`
}
