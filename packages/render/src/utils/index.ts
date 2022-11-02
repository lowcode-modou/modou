import { name } from '../../package.json'

export { ReactRenderHost } from './ReactRenderHost'

export const generateRecoilKey = (key: string): string => {
  return `@${name}/${key}`
}
