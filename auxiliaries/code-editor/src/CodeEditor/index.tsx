import CodeMirror from 'codemirror'
import React, { type FC, useEffect, useRef } from 'react'

import {
  CodeEditorModeEnum,
  CodeEditorThemeEnum,
  CodeEditorThemes,
} from '@modou/code-editor/CodeEditor/editor-config'
import { mcss } from '@modou/css-in-js'

import './code-mirror-libs'
import './modes'

export const CodeEditor: FC<{}> = (props) => {
  const cmWrapperRef = useRef<HTMLDivElement>(null)
  const cmRef = useRef<CodeMirror.Editor | null>(null)
  useEffect(() => {
    if (!cmWrapperRef.current) {
      return
    }
    if (!cmRef.current) {
      cmRef.current = CodeMirror(cmWrapperRef.current, {
        value: `{{const name = '小明'}}`,
        mode: CodeEditorModeEnum.TextWithJs,
        tabindex: 1,
        lineWrapping: true,
        theme: CodeEditorThemes[CodeEditorThemeEnum.Light],
        viewportMargin: Infinity,
        hintOptions: {
          completeSingle: false,
        },
        autoRefresh: {
          delay: 50,
        },
      })
    }
  }, [])
  return (
    <div className={classes.wrapper}>
      <div className={classes.cmWrapper} tabIndex={0} ref={cmWrapperRef} />
    </div>
  )
}

const classes = {
  wrapper: mcss`
		border: 1px solid red;
  `,
  cmWrapper: mcss`
    height: 100%;
		width: 100%;
    overflow: hidden;
    .CodeMirror {
       width: 100%;
       height: 100px;
       padding: 0;
       border-radius: var(--chakra-radii-sm);
       background: var(--chakra-colors-gray-100);
       color: var(--chakra-colors-gray-800);
       transition-property: var(--chakra-transition-property-common);
       transition-duration: var(--chakra-transition-duration-normal);
       &:hover {
         background: var(--chakra-colors-gray-200);
       }
 
       .cm-sunmao-ui {
         background: var(--chakra-colors-green-100);
       }
    }
    .CodeMirror .CodeMirror-scroll {
          max-height: 125px
};
    
  `,
}
