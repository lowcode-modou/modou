import { FC } from 'react'

import { CodeEditor } from '@modou/code-editor'
import {
  CodeEditorModeEnum,
  CodeEditorSizeEnum,
  CodeEditorTabBehaviourEnum,
  CodeEditorThemeEnum,
} from '@modou/code-editor/CodeEditor/editor-config'

const Demo: FC = () => {
  return (
    <CodeEditor
      input={{
        value: `const name = '小明';`,
        onChange: (value) => {
          console.log('onChange', value)
        },
      }}
      marking={[]}
      hinting={[]}
      mode={CodeEditorModeEnum.Javascript}
      size={CodeEditorSizeEnum.Compact}
      tabBehaviour={CodeEditorTabBehaviourEnum.Input}
      theme={CodeEditorThemeEnum.Light}
    />
  )
}

export default Demo
