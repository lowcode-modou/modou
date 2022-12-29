import CodeMirror from 'codemirror'
import { isEmpty } from 'lodash'

import { MarkHelper } from '@modou/code-editor/CodeEditor/common/editor-config'
import { AUTOCOMPLETE_MATCH_REGEX } from '@modou/code-editor/CodeEditor/constants/bindings'

export const bindingMarker: MarkHelper = (editor: CodeMirror.Editor) => {
  editor.eachLine((line: CodeMirror.LineHandle) => {
    const lineNo = editor.getLineNumber(line) ?? 0
    let match
    while ((match = AUTOCOMPLETE_MATCH_REGEX.exec(line.text)) != null) {
      const opening = {
        start: match.index,
        end: match.index + 2,
      }
      const ending = {
        start: AUTOCOMPLETE_MATCH_REGEX.lastIndex - 2,
        end: AUTOCOMPLETE_MATCH_REGEX.lastIndex,
      }

      const marks = editor.findMarks(
        { ch: ending.start, line: lineNo },
        { ch: ending.end, line: lineNo },
      )
      if (isEmpty(marks)) {
        editor.markText(
          { ch: ending.start, line: lineNo },
          { ch: ending.end, line: lineNo },
          {
            className: 'binding-brackets',
          },
        )
        editor.markText(
          { ch: opening.start, line: lineNo },
          { ch: opening.end, line: lineNo },
          {
            className: 'binding-brackets',
          },
        )
        editor.markText(
          { ch: opening.start, line: lineNo },
          { ch: ending.end, line: lineNo },
          {
            className: 'binding-highlight',
          },
        )
      }
    }
  })
}
