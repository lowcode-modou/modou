import CodeMirror from 'codemirror'
import 'codemirror/addon/hint/sql-hint'
import 'codemirror/addon/mode/multiplex'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/sql/sql'

import { CodeEditorModeEnum } from '@modou/code-editor/CodeEditor/common/editor-config'

CodeMirror.defineMode(CodeEditorModeEnum.TextWithJs, (config) =>
  CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, CodeEditorModeEnum.Text),
    {
      open: '{{',
      close: '}}',
      mode: CodeMirror.getMode(config, {
        name: CodeEditorModeEnum.Javascript,
      }),
    },
  ),
)

CodeMirror.defineMode(CodeEditorModeEnum.JsonWithJs, (config) =>
  CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, {
      name: CodeEditorModeEnum.Javascript,
      json: true,
    }),
    {
      open: '{{',
      close: '}}',
      mode: CodeMirror.getMode(config, {
        name: CodeEditorModeEnum.Javascript,
      }),
    },
  ),
)
