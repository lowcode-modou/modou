import { object } from '@recoiljs/refine'
import CodeMirror from 'codemirror'

export enum CodeEditorModeEnum {
  Text = 'text/plain',
  SQL = 'sql',
  TextWithJs = 'text-js',
  Json = 'application/json',
  JsonWithJs = 'json-js',
  SQLWithJs = 'sql-js',
  Javascript = 'javascript',
  Graphql = 'graphql',
  GraphqlWithJs = 'graphql-js',
}

export enum CodeEditorThemeEnum {
  Light = 'LIGHT',
  Dark = 'DARK',
}

export enum CodeEditorTabBehaviourEnum {
  Input = 'INPUT',
  Indent = 'INDENT',
}

export enum CodeEditorSizeEnum {
  Compact = 'COMPACT',
  Extended = 'EXTENDED',
}

export const CodeEditorThemes: Record<CodeEditorThemeEnum, string> = {
  [CodeEditorThemeEnum.Light]: 'duotone-light',
  [CodeEditorThemeEnum.Dark]: 'duotone-dark',
}

export enum CodeEditorBorder {
  NONE = 'none',
  ALL_SIDE = 'all-side',
  BOTTOM_SIDE = 'bottom-side',
}

export enum AutocompleteCloseKeyEnum {
  Enter,
  Tab,
  Escape,
  Comma,
  Semicolon,
  Space,
  Delete,
  'Ctrl+Backspace',
  OSLeft,
  '(',
  ')',
}

// TODO
type DataTree = object
// TODO
type AdditionalDynamicDataTree = object
// TODO
export interface FieldEntityInformation {
  entityName?: string
}
export type HintHelper = (
  editor: CodeMirror.Editor,
  data: DataTree,
  customDataTree?: AdditionalDynamicDataTree,
) => Hinter

export interface Hinter {
  showHint: (
    editor: CodeMirror.Editor,
    entityInformation: FieldEntityInformation,
    additionalData?: any,
  ) => boolean
  update?: (data: DataTree) => void
  fireOnFocus?: boolean
}

export type MarkHelper = (editor: CodeMirror.Editor) => void

export interface CodeEditorConfig {
  theme: CodeEditorThemeEnum
  mode: CodeEditorModeEnum
  tabBehaviour: CodeEditorTabBehaviourEnum
  size: CodeEditorSizeEnum
  hinting: HintHelper[]
  marking: MarkHelper[]
  folding?: boolean
}
