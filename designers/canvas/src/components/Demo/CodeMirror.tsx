import { autocompletion } from '@codemirror/autocomplete'
import { defaultKeymap, indentWithTab } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { keymap } from '@codemirror/view'
import { EditorView, basicSetup } from 'codemirror'
import { FC, useEffect, useRef } from 'react'

import { mcss } from '@modou/css-in-js'

export const CodeMirror: FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // const startState = EditorState.create({
    //   doc: 'var a = 123;',
    //
    // })
    const view = new EditorView({
      extensions: [
        basicSetup,
        javascript({
          // typescript: true,
          jsx: false,
        }),
        autocompletion({
          activateOnTyping: true,
          maxRenderedOptions: 30,
        }),
        keymap.of([...defaultKeymap, indentWithTab]),
      ],
      parent: wrapperRef.current!,
    })
    return () => {
      view.destroy()
    }
  }, [])

  return <div ref={wrapperRef} className={classes.wrapper} />
}

const classes = {
  // TODO 颜色使用theme
  wrapper: mcss`
    //border-radius: 4px;
    .cm-content{
      padding: 1px 0;
    }
    .cm-editor{
			border-radius: 4px;
			border: 1px solid #d9d9d9;
      overflow-y: hidden;
			&:hover{
				border-color: #4096ff;
			}
			&.cm-focused{
        //outline: 1px solid red;
        outline: none;
				border-color: #4096ff;
				box-shadow: 0 0 0 2px rgb(5 145 255 / 10%);
      }
      .cm-gutters{
        display: none;
      }
    }
  `,
}
