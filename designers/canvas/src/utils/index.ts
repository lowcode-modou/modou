import { name } from '../../package.json'

export const generateRecoilKey = (key: string): string => {
  return `@${name}/${key}`
}
