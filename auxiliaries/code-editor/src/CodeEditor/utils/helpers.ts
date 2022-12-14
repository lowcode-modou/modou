export const PlatformOSEnum = {
  MAC: 'MAC',
  IOS: 'IOS',
  LINUX: 'LINUX',
  ANDROID: 'ANDROID',
  WINDOWS: 'WINDOWS',
}

const platformOSRegex = {
  [PlatformOSEnum.MAC]: /mac.*/i,
  [PlatformOSEnum.IOS]: /(?:iphone|ipod|ipad|Pike v.*)/i,
  [PlatformOSEnum.LINUX]: /(?:linux.*)/i,
  [PlatformOSEnum.ANDROID]: /android.*|aarch64|arm.*/i,
  [PlatformOSEnum.WINDOWS]: /win.*/i,
}

export const getPlatformOS = () => {
  const browserPlatform =
    typeof navigator !== 'undefined' ? navigator.platform : null
  if (browserPlatform) {
    const platformOSList = Object.entries(platformOSRegex)
    const platform = platformOSList.find(([, regex]) =>
      regex.test(browserPlatform),
    )
    return platform ? platform[0] : null
  }
  return null
}
