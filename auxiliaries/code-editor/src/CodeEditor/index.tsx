import React, { type FC, useRef } from 'react'

import { mcss } from '@modou/css-in-js'

import './code-mirror-libs'
import './modes'

export const CodeEditor: FC<{}> = (props) => {
  const editorTarget = useRef<HTMLDivElement>(null)
  return (
    <div className={editorWrapperStyle}>
      <div className="CodeEditorTarget" tabIndex={0} ref={editorTarget}>
        CodeEditor
      </div>
    </div>
  )
}

const editorWrapperStyle = mcss`
`
