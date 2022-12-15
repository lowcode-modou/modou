import {
  useDebounceFn,
  useGetState,
  useLatest,
  useMemoizedFn,
  useMount,
  useUnmount,
} from 'ahooks'
import CodeMirror, { EditorConfiguration, EditorEventMap } from 'codemirror'
import { UpdateLintingCallback } from 'codemirror/addon/lint/lint'
import React, { type FC, useRef } from 'react'

import { CodeEditorContextProps } from '@modou/code-editor/CodeEditor/contexts/CodeEditorContext'
import {
  CodeEditorConfig,
  CodeEditorSizeEnum,
  CodeEditorTabBehaviourEnum,
  CodeEditorThemes,
  FieldEntityInformation,
  MarkHelper,
  isCloseKey,
  isModifierKey,
} from '@modou/code-editor/CodeEditor/editor-config'
import {
  autoIndentCode,
  getAutoIndentShortcutKey,
} from '@modou/code-editor/CodeEditor/utils/autoIndent'
import { AutocompleteDataTypeEnum } from '@modou/code-editor/CodeEditor/utils/autocomplete/codemirror-tern-service'
import {
  getInputValue,
  removeNewLineChars,
} from '@modou/code-editor/CodeEditor/utils/code-editor'
import { getMoveCursorLeftKey } from '@modou/code-editor/CodeEditor/utils/cursor-left-movement'
import { ExpectedValueExample } from '@modou/code-editor/CodeEditor/utils/validation/common'
import { mcss } from '@modou/css-in-js'

import './code-mirror-libs'
import './modes'

export interface CodeEditorExpected {
  type: string
  example: ExpectedValueExample
  autocompleteDataType: AutocompleteDataTypeEnum
}

interface WrappedFieldInputProps {
  value?: any
  onChange?: (value: any) => void
}

interface EditorStyleProps {
  placeholder?: string
  disabled?: boolean
  height?: string | number
  dataTreePath?: string
  expected?: CodeEditorExpected
}

interface GutterConfig {
  line: number
  element: HTMLElement
  isFocusedAction: () => void
}

interface CodeEditorGutter {
  getGutterConfig:
    | ((editorValue: string, cursorLineNumber: number) => GutterConfig | null)
    | null
  gutterId: string
}

type CodeEditorProps = EditorStyleProps &
  CodeEditorConfig &
  CodeEditorContextProps & {
    input: WrappedFieldInputProps
  } & {
    isReadOnly?: boolean
    customGutter?: CodeEditorGutter
  }
const updateMarkings = (editor: CodeMirror.Editor, marking: MarkHelper[]) => {
  marking.forEach((helper) => helper(editor))
}
export const CodeEditor: FC<CodeEditorProps> = (props) => {
  const latestProps = useLatest(props)
  const editorTarget = useRef<HTMLDivElement>(null)
  const codeEditorInstance = useRef<CodeMirror.Editor>()
  const editorCallbackRef = useRef<{
    updateLintingCallback?: UpdateLintingCallback
  }>({})

  // state start
  const [isFocused, setIsFocused, getIsFocused] = useGetState(false)
  const [changeStarted, setChangeStarted, getChangeStarted] = useGetState(false)
  // state end

  // handle start
  const handleBeforeChange = useMemoizedFn<EditorEventMap['beforeChange']>(
    (instance, change) => {
      if (change.origin === 'paste') {
        // Remove all non ASCII quotes since they are invalid in Javascript
        const formattedText = change.text.map((line) => {
          let formattedLine = line.replace(/[‘’]/g, "'")
          formattedLine = formattedLine.replace(/[“”]/g, '"')
          return formattedLine
        })
        if (change.update) {
          change.update(undefined, undefined, formattedText)
        }
      }
    },
  )

  const { run: handleChange } = useDebounceFn<EditorEventMap['change']>(
    useMemoizedFn<EditorEventMap['change']>((instance, changeObj) => {
      const value = codeEditorInstance.current?.getValue() ?? ''
      const inputValue = latestProps.current.input.value || ''
      if (
        latestProps.current.input.onChange &&
        ((value !== inputValue && getIsFocused()) || getChangeStarted())
      ) {
        setChangeStarted(false)
        latestProps.current.input.onChange(value)
      }
      if (codeEditorInstance.current) {
        updateMarkings(codeEditorInstance.current, latestProps.current.marking)
      }
    }),
    {
      wait: 600,
    },
  )

  const startChange = useMemoizedFn<EditorEventMap['change']>(
    (instance, changeObj) => {
      /* This action updates the status of the savingEntity to true so that any
      shortcut commands do not execute before updating the entity in the store */

      console.log('__startChange')
      const value = codeEditorInstance.current!.getValue() || ''
      const inputValue = latestProps.current.input.value || ''
      if (
        latestProps.current.input.onChange &&
        value !== inputValue &&
        getIsFocused() &&
        !getChangeStarted()
      ) {
        setChangeStarted(true)
        // TODO mapProps
        console.log('TODO mapProps startingEntityUpdate')
      }
      handleChange(instance, changeObj)
    },
  )

  const getEntityInformation = useMemoizedFn<() => FieldEntityInformation>(
    () => {
      const { dataTreePath, dynamicData, expected } = props
      const entityInformation: FieldEntityInformation = {
        expectedType: expected?.autocompleteDataType,
      }

      if (dataTreePath) {
        const { entityName, propertyPath } =
          getEntityNameAndPropertyPath(dataTreePath)
        entityInformation.entityName = entityName
        const entity = dynamicData[entityName]

        if (entity) {
          if ('ENTITY_TYPE' in entity) {
            const entityType = entity.ENTITY_TYPE
            if (
              entityType === ENTITY_TYPE.WIDGET ||
              entityType === ENTITY_TYPE.ACTION ||
              entityType === ENTITY_TYPE.JSACTION
            ) {
              entityInformation.entityType = entityType
            }
          }
          if (isActionEntity(entity))
            entityInformation.entityId = entity.actionId
          if (isWidgetEntity(entity)) {
            const isTriggerPath = entity.triggerPaths[propertyPath]
            entityInformation.entityId = entity.widgetId
            if (isTriggerPath)
              entityInformation.expectedType = AutocompleteDataType.FUNCTION
          }
        }
        entityInformation.propertyPath = propertyPath
      }
      return entityInformation
    },
  )

  const handleAutocompleteVisibility = useMemoizedFn(
    (instance: CodeMirror.Editor) => {
      if (!getIsFocused()) return
      const entityInformation = this.getEntityInformation()
      const { blockCompletions } = this.props
      let hinterOpen = false
      for (let i = 0; i < this.hinters.length; i++) {
        hinterOpen = this.hinters[i].showHint(instance, entityInformation, {
          blockCompletions,
          datasources: this.props.datasources.list,
          pluginIdToImageLocation: this.props.pluginIdToImageLocation,
          recentEntities: this.props.recentEntities,
          update: this.props.input.onChange?.bind(this),
          executeCommand: (payload: any) => {
            this.props.executeCommand({
              ...payload,
              callback: (binding: string) => {
                const value = this.editor.getValue() + binding
                this.updatePropertyValue(value, value.length)
              },
            })
          },
        })
        if (hinterOpen) break
      }
      this.setState({ hinterOpen })
    },
  )

  const handleAutocompleteKeyup = useMemoizedFn<EditorEventMap['keyup']>(
    (instance, event) => {
      const key = event.key
      if (isModifierKey(key)) return
      const code = `${event.ctrlKey ? 'Ctrl+' : ''}${event.code}`
      if (isCloseKey(code) || isCloseKey(key)) {
        instance.closeHint()
        return
      }
      const cursor = instance.getCursor()
      const line = instance.getLine(cursor.line)
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
      showAutocomplete && this.handleAutocompleteVisibility(instance)
    },
  )

  // const handleEditorFocus = useCallback<EditorEventMap['focus']>(
  //   (instance) => {
  //     setIsFocused(true)
  //     const { ch, line, sticky } = instance.getCursor()
  //     // Check if it is a user focus
  //     if (
  //       ch === 0 &&
  //       line === 0 &&
  //       sticky === null &&
  //       Math.random() > 0.5
  //       // TODO remove pre line mapStateToProps latestProps.current.editorLastCursorPosition
  //     ) {
  //       console.log('instance.setCursor')
  //       // instance.setCursor(latestProps.current.editorLastCursorPosition)
  //     }
  //
  //     if (!instance.state.completionActive) {
  //       updateCustomDef(latestProps.current.additionalDynamicData)
  //
  //       const entityInformation = this.getEntityInformation()
  //       const { blockCompletions } = this.props
  //       this.hinters
  //         .filter((hinter) => hinter.fireOnFocus)
  //         .forEach(
  //           (hinter) =>
  //             hinter.showHint &&
  //             hinter.showHint(cm, entityInformation, blockCompletions),
  //         )
  //     }
  //
  //     if (latestProps.current.onEditorFocus) {
  //       latestProps.current.onEditorFocus()
  //     }
  //   },
  //   [latestProps, setIsFocused],
  // )

  // handle end

  useMount(() => {
    const options: EditorConfiguration = {
      autoRefresh: true,
      mode: latestProps.current.mode,
      theme: CodeEditorThemes.LIGHT,
      viewportMargin: 10,
      tabSize: 2,
      autoCloseBrackets: true,
      indentWithTabs: false,
      lineWrapping: true,
      lineNumbers: false,
      addModeClass: true,
      matchBrackets: false,
      scrollbarStyle:
        latestProps.current.size !== CodeEditorSizeEnum.Compact
          ? 'native'
          : 'null',
      placeholder: '测试placeholder',
      tabindex: -1,
      lint: {
        getAnnotations: (_: string, callback: UpdateLintingCallback) => {
          editorCallbackRef.current.updateLintingCallback = callback
        },
        async: true,
        lintOnChange: false,
      },
    }

    const gutters = new Set<string>()

    if (!latestProps.current.input.onChange || latestProps.current.disabled) {
      options.readOnly = true
      options.scrollbarStyle = 'null'
    }

    const moveCursorLeftKey = getMoveCursorLeftKey()

    options.extraKeys = {
      [moveCursorLeftKey]: 'goLineStartSmart',
    }

    if (latestProps.current.tabBehaviour === CodeEditorTabBehaviourEnum.Input) {
      options.extraKeys.Tab = false
    }
    if (latestProps.current.customGutter) {
      gutters.add(latestProps.current.customGutter.gutterId)
    }

    if (!latestProps.current.isReadOnly) {
      const autoIndentKey = getAutoIndentShortcutKey()
      options.extraKeys[autoIndentKey] = (editor) => {
        autoIndentCode(editor)
      }
    }

    if (latestProps.current.folding) {
      // @ts-expect-error: Types are not available
      options.foldGutter = true
      gutters.add('CodeMirror-linenumbers')
      gutters.add('CodeMirror-foldgutter')
      // @ts-expect-error: Types are not available
      options.foldOptions = {
        widget: () => {
          return '\u002E\u002E\u002E'
        },
      }
    }
    options.gutters = [...gutters]

    // Set value of the editor
    const inputValue = getInputValue(latestProps.current.input.value) || ''
    if (latestProps.current.size === CodeEditorSizeEnum.Compact) {
      options.value = removeNewLineChars(inputValue)
    } else {
      options.value = inputValue
    }

    // @ts-expect-error: Types are not available
    options.finishInit = (editor: CodeMirror.Editor) => {
      // If you need to do something with the editor right after it’s been created,
      // put that code here.
      //
      // This helps with performance: finishInit() is called inside
      // CodeMirror’s `operation()` (https://codemirror.net/doc/manual.html#operation
      // which means CodeMirror recalculates itself only one time, once all CodeMirror
      // changes here are completed
      //

      editor.on('beforeChange', handleBeforeChange)
      editor.on('change', startChange)
      editor.on('keyup', handleAutocompleteKeyup)
      editor.on('keyup', handleAutocompleteKeyup)
      // editor.on('focus', handleEditorFocus)
    }

    // codeEditorInstance.current = CodeMirror(editorTarget.current!, {
    //   value: `const name = '小明';`,
    //   mode: {
    //     name: CodeEditorModeEnum.Javascript,
    //   },
    // })22111212212112122112
    codeEditorInstance.current = CodeMirror(editorTarget.current!, options)
  })

  useUnmount(() => {
    // TODO 确认是否彻底销毁
    const editorWrapperElement = codeEditorInstance.current?.getWrapperElement()
    codeEditorInstance.current?.off('beforeChange', handleBeforeChange)
    codeEditorInstance.current?.off('change', startChange)
    codeEditorInstance.current?.off('keyHandled', handleAutocompleteKeyup)
    if (editorWrapperElement) {
      editorTarget.current?.removeChild(editorWrapperElement)
    }
  })

  return (
    <div className={editorWrapperStyle}>
      <div className="CodeEditorTarget" tabIndex={0} ref={editorTarget}></div>
    </div>
  )
}

const editorWrapperStyle = mcss`
	width: 100%;
	// TODO dyn props
	min-height: 36px;
	// TODO props height
	height: auto;
	// TODO props bgColor
	background-color: rgba(0,0,0,.03);
  // TODO props disabled bgColor
  display: flex;
  flex: 1;
  flex-direction: row;
  text-transform: none;
  // TODO hover style
  &&{
		.CodeMirror-cursor {
			border-right: none;
			border-left-width: 2px;
      // TODO border left color
      border-left-color: #333;
		}
		.cm-s-duotone-light.CodeMirror {
			padding: 0 6px;
			border-radius: 0;
			// TODO border color
			border: 1px solid red;
			// TODO border background
			// TODO 常量化 Color
			color: #6D6D6D;
			& {
				span.cm-operator {
					color: #333;
				}
			}
		}
		.cm-s-duotone-light .CodeMirror-gutters {
			// TODO 常量化 Color
			background: #F0F0F0;
		}
		.cm-s-duotone-dark.CodeMirror {
			border-radius: 0;
			// TODO 常量化 Color and dny border
			border: 1px solid #2B2B2B;
			// TODO dny background
			background: #262626;
			// TODO 常量化 Color
			color:#D4D4D4;
		}
		.cm-s-duotone-light .CodeMirror-linenumber,
		.cm-s-duotone-dark .CodeMirror-linenumber {
			// TODO 常量化 Color
			color: #6D6D6D;
		}
		.cm-s-duotone-dark .CodeMirror-gutters {
			// TODO 常量化 Color
			background: #232324;
		}
		.binding-brackets {
			color: #333;
			font-weight: 700;
		}
		.CodeMirror-matchingbracket {
			text-decoration: none;
			color: #ffd600 !important;
			background-color: #a74444;
		}
		.datasource-highlight {
			background: #e7f3ff;
			border: 1px solid #69b5ff;
			padding: 2px;
			border-radius: 2px;
			margin-right: 2px;
		}
		.datasource-highlight-error {
			background: #FFF0F0;
			border: 1px solid #F22B2B;
		}
		.datasource-highlight-success {
			background: #E3FFF3;
			border: 1px solid #03B365;
		}
		.CodeMirror {
			flex: 1;
			line-height: 21px;
			z-index: 0;
			border-radius: 4px;
			height: auto;
		}
		// TODO CodeMirror-cursor disabled @L197
		.CodeMirror pre.CodeMirror-placeholder {
			color: #555555;
		}
		// TODO CodeMirror-hscrollbar disabled @L204
  }
  &&{
		.CodeMirror-lines {
			padding: 2px 0;
      // TODO dyn
			background-color: #eef2f5;
			// TODO dyn
			cursor: text
    };
  }
  // TODO 待验证
  &.js-editor{
		overflow: hidden;
		.cm-tab {
			border-right: 1px dotted #ccc;
		}
  }
  // TODO 带验证
	.bp3-popover-target {
		padding-right: 10px;
		padding-top: 5px;
	}
	.leftImageStyles {
		width: 20px;
		height: 20px;
		margin: 5px;
	}
	.linkStyles {
		margin: 5px 11px 5px 5px;
	}
	.CodeMirror-foldmarker {
		color: inherit;
		text-shadow: none;
		font: inherit;
	}
	.CodeEditorTarget {
		width: 100%;

		&:focus {
			border: 1px solid green;
			.CodeMirror.cm-s-duotone-light {
				border: none;
			}
		}
    // TODO  COMPACT @L260
		position: relative;
		// TODO  isFocused @L269
		// TODO  height @L269
    height: auto;
    // TODO after styles @L271  
	}
`
