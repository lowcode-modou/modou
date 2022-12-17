import CodeMirror from 'codemirror'
import React, { type FC, useEffect, useRef } from 'react'
import tern, { Server } from 'tern'

import { CodeEditorModeEnum } from '@modou/code-editor/CodeEditor/editor-config'
import { DEFS } from '@modou/code-editor/CodeEditor/tern/defs'
import { injectGlobal, mcss } from '@modou/css-in-js'

import './code-mirror-libs'
import './modes' // TODO: tern uses global variable, maybe there is some workaround

;(window as unknown as { tern: typeof tern }).tern = tern
export const EXPRESSION = {
  START: '{{',
  END: '}}',
}
export type ExpChunk = string | ExpChunk[]

const parseExpression = (rawExp: string): ExpChunk[] => {
  const exp = rawExp.trim()

  function lexer(str: string): string[] {
    let token = ''
    let chars = ''
    let charsNext = ''
    let i = 0
    const res = []
    const collectToken = () => {
      if (token) {
        res.push(token)
        token = ''
      }
    }
    while ((chars = str.slice(i, i + EXPRESSION.START.length))) {
      switch (chars) {
        case EXPRESSION.START:
          // move cursor
          i += EXPRESSION.START.length
          collectToken()
          res.push(chars)
          break
        case EXPRESSION.END: {
          let j = i + 1
          // looking ahead
          while ((charsNext = str.slice(j, j + EXPRESSION.END.length))) {
            if (charsNext === EXPRESSION.END) {
              token += str[i]
              // move two cursors
              j++
              i++
            } else {
              // move cursor
              i += EXPRESSION.END.length
              collectToken()
              res.push(chars)
              break
            }
          }
          break
        }
        default:
          token += str[i]
          // move cursor
          i++
      }
    }
    if (token) {
      res.push(token)
    }
    return res
  }

  function build(tokens: string[]): ExpChunk[] {
    const result: ExpChunk[] = []
    let item

    while ((item = tokens.shift())) {
      if (item === EXPRESSION.END) return result
      result.push(item === EXPRESSION.START ? build(tokens) : item)
    }
    return result
  }

  const tokens = lexer(exp)
  const result = build(tokens)

  return result
}
const getCursorIndex = (editor: CodeMirror.Editor) => {
  const cursor = editor.getCursor()
  let cursorIndex = cursor.ch
  if (cursor.line > 0) {
    for (let lineIndex = 0; lineIndex < cursor.line; lineIndex++) {
      const line = editor.getLine(lineIndex)
      cursorIndex = cursorIndex + line.length + 1
    }
  }
  return cursorIndex
}

const checkIfCursorInsideBinding = (editor: CodeMirror.Editor): boolean => {
  let cursorBetweenBinding = false
  const value = editor.getValue()
  const cursorIndex = getCursorIndex(editor)
  const chunks = parseExpression(value)
  // count of chars processed
  let current = 0
  chunks.forEach((chunk) => {
    if (typeof chunk === 'string') {
      current += chunk.length
    } else {
      const start = current + '{{'.length
      const end = start + chunk.join('').length + '}}'.length
      if (start <= cursorIndex && cursorIndex <= end) {
        cursorBetweenBinding = true
      }
      current = end
    }
  })
  return cursorBetweenBinding
}

const installTern = (cm: CodeMirror.Editor) => {
  const t = new CodeMirror.TernServer({ defs: DEFS })
  // 将在光标或选择移动时触发，或者对编辑器内容进行任何更改
  cm.on('cursorActivity', (cm) => t.updateArgHints(cm))
  cm.on('change', (_instance, change) => {
    if (!checkIfCursorInsideBinding(_instance)) {
      return
    }
    if (
      change.text
        .concat(change.removed ?? [])
        .join('')
        .trim() === ''
    ) {
      // do not auto complete when input newline/space
      return
    }
    if (
      // change happened
      change.text.length + (change.removed?.length ?? 0) > 0 &&
      // not changed by auto-complete
      change.origin !== 'complete'
    ) {
      t.complete(cm)
    }
  })
  return t
}

export const CodeEditor: FC<{}> = (props) => {
  const cmWrapperRef = useRef<HTMLDivElement>(null)
  const cmRef = useRef<CodeMirror.Editor | null>(null)
  const tServerRef = useRef<Server | null>(null)
  useEffect(() => {
    if (!cmWrapperRef.current) {
      return
    }
    if (!cmRef.current) {
      cmRef.current = CodeMirror(cmWrapperRef.current, {
        value: `{{}}`,
        mode: CodeEditorModeEnum.TextWithJs,
        tabindex: 1,
        tabSize: 2,
        autoCloseBrackets: true,
        matchBrackets: false,
        lineWrapping: true,
        // theme: CodeEditorThemes[CodeEditorThemeEnum.Light],
        viewportMargin: Infinity,
        hintOptions: {
          completeSingle: false,
        },
        autoRefresh: {
          delay: 50,
        },
      })
      const t = installTern(cmRef.current)
      tServerRef.current = t.server
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
    border-radius: 4px;
    position: relative;
  `,
  cmWrapper: mcss`
    height: 100%;
		width: 100%;
    overflow: hidden;
    .CodeMirror {
       width: 100%;
       height: 100%;
       padding: 0;
       border-radius: 4px;
       background: #EDF2F7;
       color: #1A202C;
       transition-property: background-color,color,opacity;
       transition-duration: 0.2s;
       &:hover {
         background: #E2E8F0;
       }
    }
    .CodeMirror .CodeMirror-scroll {
          //max-height: 125px
      // };
  `,
}

injectGlobal`
  .CodeMirror-hints {
		position: absolute;
		z-index: 20;
		overflow: hidden;
		list-style: none;
		padding: 0 0;
		font-family: monospace;
		max-height: 20em;
		overflow-y: auto;
		box-shadow: 0px 0px 2px 2px #ebebeb;
		border-radius: 1px;
  }
	.CodeMirror-hint {
		height: 24px;
		color: #090707;
		cursor: pointer;
		display: flex;
		min-width: 220px;
		width: auto;
		align-items: center;
		font-size: 12px;
		line-height: 15px;
		letter-spacing: -0.24px;
		&:hover {
			background: #E8E8E8;
			border-radius: 0;
			color: #090707;
			&:after {
				color: #090707;
			}
		}
	}
	li.CodeMirror-hint-active {
		background: #6A86CE;
		border-radius: 0px;
		color: #fff;
		&:after {
			color: #fff;
		}
		&:hover {
			background: #6A86CE;
			color: #fff;
			&:after {
				color: #fff;
			}
		}
	}
`

// 优化滚动条样式
injectGlobal`
	::-webkit-scrollbar {
		width: 4px;
	}

	/* 设置滚动条的背景颜色 */
	::-webkit-scrollbar-track {
		background: #f1f1f1;
	}

	/* 设置滚动条的滑块（滑轮）的颜色 */
	::-webkit-scrollbar-thumb {
		background: #888;
	}

	/* 设置滑块（滑轮）在滚动时的颜色 */
	::-webkit-scrollbar-thumb:hover {
		background: #555;
	}
`
