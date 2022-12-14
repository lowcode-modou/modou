import { PlatformOSEnum, getPlatformOS } from './helpers'

const moveCursorLeftShortcut = {
  [PlatformOSEnum.MAC]: 'Cmd-Left',
  [PlatformOSEnum.IOS]: 'Cmd-Left',
  [PlatformOSEnum.WINDOWS]: 'Home',
  [PlatformOSEnum.ANDROID]: 'Home',
  [PlatformOSEnum.LINUX]: 'Home',
}

export const getMoveCursorLeftKey = () => {
  const platformOS = getPlatformOS()
  return platformOS ? moveCursorLeftShortcut[platformOS] : 'Home'
}
