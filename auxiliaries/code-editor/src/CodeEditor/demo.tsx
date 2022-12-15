import { FC } from 'react'

import {
  CodeEditor,
  CodeEditorModeEnum,
  CodeEditorSizeEnum,
  CodeEditorTabBehaviourEnum,
  CodeEditorThemeEnum,
} from '@modou/code-editor'

const Demo: FC = () => {
  return (
    <CodeEditor
      input={{
        value: `{{const name = '小明'}}`,
        onChange: (value) => {
          console.log('onChange', value)
        },
      }}
      marking={[]}
      hinting={[]}
      mode={CodeEditorModeEnum.TextWithJs}
      size={CodeEditorSizeEnum.Compact}
      tabBehaviour={CodeEditorTabBehaviourEnum.Input}
      theme={CodeEditorThemeEnum.Light}
    />
  )
}

export default Demo
