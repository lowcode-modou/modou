import { FC } from 'react'

import { CodeEditor } from '@modou/code-editor'
import { mock_code_editor_props } from '@modou/code-editor/CodeEditor/mock'

const Demo: FC = () => {
  return (
    <CodeEditor
      datasources={mock_code_editor_props.datasources}
      dynamicData={mock_code_editor_props.dynamicData}
      editorLastCursorPosition={mock_code_editor_props.editorLastCursorPosition}
      additionalDynamicData={mock_code_editor_props.additionalDynamicData}
      entityInformation={mock_code_editor_props.entityInformation}
      blockCompletions={mock_code_editor_props.blockCompletions}
    />
  )
}

export default Demo
