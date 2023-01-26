import CodeMirror from 'codemirror'

import { CodeMirrorTernServiceInstance } from '../autocomplete/CodeMirrorTernService'
import { KeyboardShortcuts } from '../constants/KeyboardShortcuts'
import { checkIfCursorInsideBinding } from './codeEditorUtils'
import { ENTITY_TYPE, HintHelper } from './editor-config'

export const bindingHint: HintHelper = (editor) => {
  editor.setOption('extraKeys', {
    // @ts-expect-error 暂不支持的类型
    ...editor.options.extraKeys,
    [KeyboardShortcuts.CodeEditor.OpenAutocomplete]: (cm: CodeMirror.Editor) =>
      checkIfCursorInsideBinding(cm) &&
      CodeMirrorTernServiceInstance.complete(cm),
    [KeyboardShortcuts.CodeEditor.ShowTypeAndInfo]: (cm: CodeMirror.Editor) => {
      CodeMirrorTernServiceInstance.showType(cm)
    },
    [KeyboardShortcuts.CodeEditor.OpenDocsLink]: (cm: CodeMirror.Editor) => {
      void CodeMirrorTernServiceInstance.showDocs(cm)
    },
  })
  return {
    showHint: (
      editor: CodeMirror.Editor,
      entityInformation,
      additionalData,
    ): boolean => {
      if (additionalData?.blockCompletions) {
        CodeMirrorTernServiceInstance.setEntityInformation({
          ...entityInformation,
          blockCompletions: additionalData.blockCompletions,
        })
      } else {
        CodeMirrorTernServiceInstance.setEntityInformation(entityInformation)
      }

      const entityType = entityInformation?.entityType
      let shouldShow: boolean
      if (entityType === ENTITY_TYPE.JSACTION) {
        shouldShow = true
      } else {
        shouldShow = checkIfCursorInsideBinding(editor)
      }
      if (shouldShow) {
        // TODO AnalyticsUtil
        // AnalyticsUtil.logEvent('AUTO_COMPLETE_SHOW', {})
        CodeMirrorTernServiceInstance.complete(editor)
        return true
      }
      editor.closeHint()
      return shouldShow
    },
  }
}
