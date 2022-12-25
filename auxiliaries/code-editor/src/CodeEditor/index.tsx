import { useMemoizedFn, useMount } from 'ahooks'
import CodeMirror from 'codemirror'
import React, { type FC, useEffect, useRef, useState } from 'react'

import { CodeMirrorTernServiceInstance } from '@modou/code-editor/CodeEditor/autocomplete/CodeMirrorTernService'
import { updateCustomDef } from '@modou/code-editor/CodeEditor/autocomplete/customDefUtils'
import {
  CodeEditorModeEnum,
  DataTree,
  HintHelper,
  Hinter,
  MarkHelper,
  isCloseKey,
  isModifierKey,
} from '@modou/code-editor/CodeEditor/common/editor-config'
import { bindingHint } from '@modou/code-editor/CodeEditor/common/hintHelpers'
import { bindingMarker } from '@modou/code-editor/CodeEditor/common/mark-helpers'
import {
  mock_additionalDynamicData,
  mock_blockCompletions,
  mock_datasources,
  mock_dyn_def,
  mock_dynamicData,
  mock_editorLastCursorPosition,
  mock_entityInfo,
  mock_entityInformation,
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
    const { ch, line, sticky } = cm.getCursor()
    // Check if it is a user focus
    if (
      ch === 0 &&
      line === 0 &&
      sticky === null &&
      mock_editorLastCursorPosition
    ) {
      cm.setCursor(mock_editorLastCursorPosition)
    }

    if (!cm.state.completionActive) {
      updateCustomDef(mock_additionalDynamicData)

      const entityInformation = mock_entityInformation
      const blockCompletions = mock_blockCompletions
      hintersRef.current
        ?.filter((hinter) => hinter.fireOnFocus)
        .forEach(
          (hinter) =>
            hinter?.showHint &&
            hinter.showHint(cm, entityInformation, blockCompletions),
        )
    }

    // TODO 补充
    // if (this.props.onEditorFocus) {
    //   this.props.onEditorFocus()
    // }
  })
  const handleEditorBlur = useMemoizedFn(() => {
    setaIsFocused(false)
  })

  const handleAutocompleteVisibility = useMemoizedFn(
    (cm: CodeMirror.Editor) => {
      if (!isFocused || !hintersRef.current) {
        return
      }
      const entityInformation = mock_entityInformation
      const blockCompletions = mock_blockCompletions
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

  // mock start
  useMount(() => {
    // We update the data tree definition after every eval so that autocomplete
    // is accurate
    setTimeout(() => {
      CodeMirrorTernServiceInstance.updateDef(
        'DATA_TREE',
        mock_dyn_def,
        mock_entityInfo,
      )
    })
  })
  // mock end

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

      .binding-highlight{}
      .cm {
        &-variable {
          color: #dfb967;
        }
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
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 3%), 0 1px 6px -1px rgb(0 0 0 / 2%), 0 2px 4px 0 rgb(0 0 0 / 2%);
    border-radius: 2px;
  }

  .CodeMirror-hint {
    height: 24px;
    background-color: #fff;
    color: #090707;
    cursor: pointer;
    display: flex;
    min-width: 220px;
    width: auto;
    align-items: center;
    font-size: 12px;
    line-height: 24px;
    padding: 0 8px;
    &-header{
      padding-left: 8px;
      color: rgba(0,0,0,.45);
      pointer-events: none !important;
      font-weight: bold;
    }

    &::before {
      position: static;
      margin-right: 4px;
      border-radius: 100%;
    }

    &:hover {
      background: #E8E8E8;
      border-radius: 0;
      color: #090707;

      &:after {
        color: #090707;
      }
    }
  }

  .CodeMirror-Tern-completion-keyword:before {
    content: "K";
    background-color: #ce8080;
  }

  li.CodeMirror-hint-active {
    background: #6A86CE;
    border-radius: 0;
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
		width: 2px;
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
