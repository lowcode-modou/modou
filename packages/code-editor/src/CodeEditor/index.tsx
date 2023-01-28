import { useDebounceFn, useMemoizedFn, useMount } from 'ahooks'
import CodeMirror from 'codemirror'
import React, { type FC, useEffect, useRef, useState } from 'react'
import { Def } from 'tern'

// import { ExpectedValueExample } from '@modou/code-editor/CodeEditor/utils/validation/common'
import { injectGlobal, mcss } from '@modou/css-in-js'
import { MDTernDefs } from '@modou/refine'

import { CodeMirrorTernServiceInstance } from './autocomplete/CodeMirrorTernService'
import { updateCustomDef } from './autocomplete/customDefUtils'
import './common/code-mirror-libs'
import {
  CodeEditorModeEnum,
  DataTree,
  HintHelper,
  Hinter,
  MarkHelper,
  isCloseKey,
  isModifierKey,
} from './common/editor-config'
import { bindingHint } from './common/hintHelpers'
import { bindingMarker } from './common/mark-helpers'
import './common/modes'
import { mock_code_editor_props, mock_entityInfo } from './mock'

// export type CodeEditorExpected = {
//   type: string
//   example: ExpectedValueExample
//   autocompleteDataType: AutocompleteDataType
// }

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

interface CodeEditorProps {
  onChange: (value: string) => void
  value: string
  getDataTreeDefs?: () => MDTernDefs
}

export const CodeEditor: FC<
  {
    hinting?: HintHelper[]
  } & typeof mock_code_editor_props &
    CodeEditorProps
> = (_props) => {
  const props: typeof _props = {
    ..._props,
    getDataTreeDefs: _props.getDataTreeDefs ?? (() => ({})),
    hinting: _props.hinting ?? [bindingHint],
    ...mock_code_editor_props,
  }
  const cmWrapperRef = useRef<HTMLDivElement>(null)
  const cmRef = useRef<CodeMirror.Editor | null>(null)
  const hintersRef = useRef<Hinter[] | null>(null)

  const [isFocused, setIsFocused] = useState(false)

  const handleEditorFocus = useMemoizedFn((cm: CodeMirror.Editor) => {
    setIsFocused(true)
    const { ch, line, sticky } = cm.getCursor()
    // Check if it is a user focus
    if (
      ch === 0 &&
      line === 0 &&
      sticky === null &&
      props.editorLastCursorPosition
    ) {
      cm.setCursor(props.editorLastCursorPosition)
    }

    if (!cm.state.completionActive) {
      CodeMirrorTernServiceInstance.updateDef(
        'DATA_TREE',
        props.getDataTreeDefs() as unknown as Def,
        mock_entityInfo,
      )
      updateCustomDef(props.additionalDynamicData)

      const entityInformation = props.entityInformation
      const blockCompletions = props.blockCompletions
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
    setIsFocused(false)
  })

  const handleAutocompleteVisibility = useMemoizedFn(
    (cm: CodeMirror.Editor) => {
      if (!isFocused || !hintersRef.current) {
        return
      }
      const entityInformation = props.entityInformation
      const blockCompletions = props.blockCompletions
      let hinterOpen = false
      for (let i = 0; i < hintersRef.current.length; i++) {
        hinterOpen = hintersRef.current[i].showHint(cm, entityInformation, {
          blockCompletions,
          datasources: props.datasources.list,
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
      } else if (key.charCodeAt(0) === 32) {
        // TODO 常量化 32 代表空格 code
        showAutocomplete = true
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
        value: props.value,
        mode: CodeEditorModeEnum.TextWithJs,
        tabindex: -1,
        tabSize: 2,
        autoCloseBrackets: true,
        matchBrackets: false,
        lineWrapping: true,
        // theme: CodeEditorThemes[CodeEditorThemeEnum.Light],
        theme: 'duotone-light',
        addModeClass: true,
      })

      updateMarkings(cmRef.current as unknown as CodeMirror.Editor, [
        bindingMarker,
      ])

      hintersRef.current = startAutocomplete(
        cmRef.current,
        props.hinting ?? [],
        props.dynamicData as unknown as any,
      )
    } else {
      updateMarkings(cmRef.current, [bindingMarker])
    }
  })

  const { run: debounceOnChange } = useDebounceFn(props.onChange, {
    wait: 300,
  })

  const handleChange = useMemoizedFn(() => {
    if (!cmRef.current) {
      return
    }
    updateMarkings(cmRef.current, [bindingMarker])
    debounceOnChange(cmRef.current?.getValue())
  })

  useEffect(() => {
    if (!cmRef.current) {
      return
    }
    const editorValue = cmRef.current.getValue()
    if (editorValue !== props.value) {
      cmRef.current.setValue(props.value)
      // when input gets updated on focus out clear undo/redo from codeMirror History
      cmRef.current.clearHistory()
    }
  }, [props.value])

  useEffect(() => {
    cmRef.current?.on('change', handleChange)
    cmRef.current?.on('keyup', handleAutocompleteKeyup)
    cmRef.current?.on('focus', handleEditorFocus)
    cmRef.current?.on('blur', handleEditorBlur)
    return () => {
      cmRef.current?.off('change', handleChange)
      cmRef.current?.off('keyup', handleAutocompleteKeyup)
      cmRef.current?.off('focus', handleEditorFocus)
      cmRef.current?.off('blur', handleEditorBlur)
    }
  }, [
    handleAutocompleteKeyup,
    handleChange,
    handleEditorBlur,
    handleEditorFocus,
  ])

  // mock start
  // TODO 移除mock 等待元数据变化时候执行更新
  useMount(() => {
    // We update the data tree definition after every eval so that autocomplete
    // is accurate
    setTimeout(() => {
      CodeMirrorTernServiceInstance.updateDef(
        'DATA_TREE',
        props.getDataTreeDefs() as unknown as Def,
        mock_entityInfo,
      )
    })

    // setTimeout(() => {
    //   CodeMirrorTernServiceInstance.updateDef(
    //     'DATA_TREE',
    //     mock_dyn_def_1,
    //     mock_entityInfo,
    //   )
    // }, 5000)
  })
  // mock end

  return (
    <>
      <div className={classes.wrapper}>
        <div className={classes.cmWrapper} tabIndex={0} ref={cmWrapperRef} />
      </div>
      {/*
      <div className={evaluatedClasses.wrapper}>
        <div>
          <Typography.Title level={5}>预期结构</Typography.Title>
          <Typography.Text type="success">{}</Typography.Text>
        </div>
        <div>
          <Typography.Title level={5}>预期结构 - 示例</Typography.Title>
          <Typography.Text type="success">
            EXPECTED STRUCTURE - EXAMPLE
          </Typography.Text>
        </div>
        <div>
          <Typography.Title level={5}>计算值</Typography.Title>
          <Typography.Text type="success">EVALUATED VALUE</Typography.Text>
        </div>
      </div>
*/}
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
      background: #EDF2F7!important;
      color: rgba(0, 0, 0, 0.88)!important;
      transition-property: background-color, color, opacity;
      transition-duration: 0.2s;
      line-height: 20px;
      font-size: 14px;

      &:hover {
        background: #E2E8F0;
      }

      &-cursor {
        border-right: none!important;
        border-left-width: 2px!important;
        //border-left-color: #153c15;
        border-left-color: #153c15!important;
      }

      .binding-brackets {
        font-weight: bold;
        color: #f26a02;
      }

      .binding-highlight {
      }

      .cm {
      }
    }
  }

  .CodeMirror .CodeMirror-scroll {
    //max-height: 125px
    // };
  `,
}

// const evaluatedClasses = {
//   wrapper: mcss`
//     border: 1px solid green;
//   `,
// }

injectGlobal`
  .CodeMirror{
    &-hints {
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
    }
    &-hint {
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
        position: static!important;
        margin-right: 4px!important;
        border-radius: 100% !important;
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
    &-Tern-completion-keyword:before {
      content: "K";
      background-color: #ce8080;
    }
    &-hint-active {
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
  }
`
