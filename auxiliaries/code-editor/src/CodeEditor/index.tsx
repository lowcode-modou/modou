import { useMemoizedFn, useMount, useUnmount } from 'ahooks'
import CodeMirror, { EditorEventMap } from 'codemirror'
import React, { type FC, useEffect, useRef, useState } from 'react'

import { AutocompleteDataType } from '@modou/code-editor/CodeEditor/autocomplete/CodeMirrorTernService'
import {
  CodeEditorModeEnum,
  DataTree,
  ENTITY_TYPE,
  FieldEntityInformation,
  HintHelper,
  Hinter,
  MarkHelper,
  isCloseKey,
  isModifierKey,
} from '@modou/code-editor/CodeEditor/common/editor-config'
import { bindingHint } from '@modou/code-editor/CodeEditor/common/hintHelpers'
import { bindingMarker } from '@modou/code-editor/CodeEditor/common/mark-helpers'
import {
  mock_datasources,
  mock_dynamicData,
} from '@modou/code-editor/CodeEditor/mock'
import { injectGlobal, mcss } from '@modou/css-in-js'

import './common/code-mirror-libs'
import './common/modes'

// TODO: tern uses global variable, maybe there is some workaround
const updateMarkings = (editor: CodeMirror.Editor, marking: MarkHelper[]) => {
  marking.forEach((helper) => helper(editor))
}

const startAutocomplete = (
  editor: CodeMirror.Editor,
  hinting: HintHelper[],
  dynamicData: DataTree,
) => {
  console.log('startAutocompletestartAutocomplete', hinting)
  return hinting.map((helper) => {
    return helper(editor, dynamicData)
  })
}

export const CodeEditor: FC<{
  hinting?: HintHelper[]
}> = (_props) => {
  const props: typeof _props = {
    ..._props,
    hinting: _props.hinting ?? [bindingHint],
  }
  const cmWrapperRef = useRef<HTMLDivElement>(null)
  const cmRef = useRef<CodeMirror.Editor | null>(null)
  const hintersRef = useRef<Hinter[] | null>(null)

  const [isFocused, setaIsFocused] = useState(false)

  const handleEditorFocus = useMemoizedFn((cm: CodeMirror.Editor) => {
    setaIsFocused(true)
  })
  const handleEditorBlur = useMemoizedFn(() => {
    setaIsFocused(false)
  })

  const handleAutocompleteVisibility = useMemoizedFn(
    (cm: CodeMirror.Editor) => {
      console.log(
        'handleAutocompleteVisibilityhandleAutocompleteVisibility',
        isFocused,
      )
      if (!isFocused || !hintersRef.current) {
        return
      }
      const entityInformation: FieldEntityInformation = {
        expectedType: AutocompleteDataType.STRING,
        entityName: 'Button1',
        entityType: ENTITY_TYPE.WIDGET,
        entityId: 'g4ifgmw7bb',
        propertyPath: 'text',
      }
      const blockCompletions = undefined
      let hinterOpen = false
      for (let i = 0; i < hintersRef.current.length; i++) {
        hinterOpen = hintersRef.current[i].showHint(cm, entityInformation, {
          blockCompletions,
          datasources: mock_datasources.list,
          pluginIdToImageLocation: {},
          recentEntities: {},
          update: () => {},
          executeCommand: (payload: any) => {},
        })
        if (hinterOpen) break
      }
    },
  )

  const handleAutocompleteKeyup = useMemoizedFn(
    (cm: CodeMirror.Editor, event: KeyboardEvent) => {
      const key = event.key
      if (isModifierKey(key)) return
      const code = `${event.ctrlKey ? 'Ctrl+' : ''}${event.code}`
      if (isCloseKey(code) || isCloseKey(key)) {
        cm.closeHint()
        return
      }
      const cursor = cm.getCursor()
      const line = cm.getLine(cursor.line)
      let showAutocomplete = false
      /* Check if the character before cursor is completable to show autocomplete which backspacing */
      if (key === '/') {
        showAutocomplete = true
      } else if (event.code === 'Backspace') {
        const prevChar = line[cursor.ch - 1]
        showAutocomplete = !!prevChar && /[a-zA-Z_0-9.]/.test(prevChar)
      } else if (key === '{') {
        /* Autocomplete for { should show up only when a user attempts to write {{}} and not a code block. */
        const prevChar = line[cursor.ch - 2]
        showAutocomplete = prevChar === '{'
      } else if (key.length === 1) {
        showAutocomplete = /[a-zA-Z_0-9.]/.test(key)
        /* Autocomplete should be triggered only for characters that make up valid variable names */
      }
      showAutocomplete && handleAutocompleteVisibility(cm)
    },
  )

  useMount(() => {
    if (!cmWrapperRef.current) {
      return
    }
    if (!cmRef.current) {
      cmRef.current = CodeMirror(cmWrapperRef.current, {
        autoRefresh: true,
        viewportMargin: 10,
        value: `{{const a = 123}}`,
        mode: CodeEditorModeEnum.TextWithJs,
        tabindex: -1,
        tabSize: 2,
        autoCloseBrackets: true,
        matchBrackets: false,
        lineWrapping: true,
        // theme: CodeEditorThemes[CodeEditorThemeEnum.Light],
        addModeClass: true,
      })

      updateMarkings(cmRef.current as unknown as CodeMirror.Editor, [
        bindingMarker,
      ])

      hintersRef.current = startAutocomplete(
        cmRef.current,
        props.hinting ?? [],
        mock_dynamicData as any,
      )
    } else {
      updateMarkings(cmRef.current, [bindingMarker])
    }
  })

  const handleChange = useMemoizedFn(() => {
    if (!cmRef.current) {
      return
    }
    updateMarkings(cmRef.current, [bindingMarker])
  })

  useEffect(() => {
    cmRef.current?.on('change', handleChange)
    cmRef.current?.on('keyup', handleAutocompleteKeyup)
    cmRef.current?.on('focus', handleEditorFocus)
    cmRef.current?.on('blur', handleEditorBlur)
    return () => {
      cmRef.current?.off('change', handleChange)
      cmRef.current?.off('keyup', handleAutocompleteKeyup)
      cmRef.current?.on('focus', handleEditorFocus)
      cmRef.current?.on('blur', handleEditorBlur)
    }
  }, [
    handleAutocompleteKeyup,
    handleChange,
    handleEditorBlur,
    handleEditorFocus,
  ])

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.cmWrapper} tabIndex={0} ref={cmWrapperRef} />
      </div>
    </>
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
			transition-property: background-color, color, opacity;
			transition-duration: 0.2s;
			line-height: 20px;

			&:hover {
				background: #E2E8F0;
			}

			.binding-brackets {
				font-weight: bold;
				color: #f26a02;
			}
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
