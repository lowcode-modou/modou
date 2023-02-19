import { customAlphabet } from 'nanoid'

export * from './dom'

const nanoid = customAlphabet('abcdefghigklmnopqrstuvwxyz', 12)
export const generateId = (size: number = 12): string => {
  return nanoid(size)
}
