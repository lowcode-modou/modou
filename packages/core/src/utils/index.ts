import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghigklmnopqrstuvwxyz', 12)
export const generateId = (): string => {
  return nanoid(12)
}
