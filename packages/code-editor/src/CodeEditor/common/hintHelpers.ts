import CodeMirror from 'codemirror'

import { CodeMirrorTernServiceInstance } from '@modou/code-editor/CodeEditor/autocomplete/CodeMirrorTernService'
import { checkIfCursorInsideBinding } from '@modou/code-editor/CodeEditor/common/codeEditorUtils'
import {
  ENTITY_TYPE,
  HintHelper,
} from '@modou/code-editor/CodeEditor/common/editor-config'
import { KeyboardShortcuts } from '@modou/code-editor/CodeEditor/constants/KeyboardShortcuts'

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
      CodeMirrorTernServiceInstance.showDocs(cm)
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
