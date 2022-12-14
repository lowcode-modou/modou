import CodeMirror from 'codemirror'
import { isNil } from 'lodash'

import { PlatformOSEnum, getPlatformOS } from './helpers'

const autoIndentShortcut = {
  [PlatformOSEnum.MAC]: 'Shift-Cmd-P',
  [PlatformOSEnum.IOS]: 'Shift-Cmd-P',
  [PlatformOSEnum.WINDOWS]: 'Shift-Alt-F',
  [PlatformOSEnum.ANDROID]: 'Shift-Alt-F',
  [PlatformOSEnum.LINUX]: 'Shift-Ctrl-I',
}
export const getAutoIndentShortcutKey = () => {
  const platformOS = getPlatformOS()
  return platformOS ? autoIndentShortcut[platformOS] : 'Shift-Alt-F'
}

export const autoIndentCode = (editor: CodeMirror.Editor) => {
  editor.eachLine((line: any) => {
    const lineNumber = editor.getLineNumber(line)
    if (!isNil(lineNumber)) {
      editor.indentLine(lineNumber, 'smart')
    }
  })
  // We need to use a setTimeout here to postpone the refresh() to after CodeMirror/Browser has updated the layout according to the new content
  setTimeout(() => editor.refresh(), 0)
}
