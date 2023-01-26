import CodeMirror from 'codemirror'

import { AutocompleteDataType } from '../autocomplete/CodeMirrorTernService'
import { TruthyPrimitiveTypes } from '../utils/TypeHelpers'
import { DataTreeEntity } from './data-tree'

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

export type MarkHelper = (editor: CodeMirror.Editor) => void

export enum ENTITY_TYPE {
  ACTION = 'ACTION',
  WIDGET = 'WIDGET',
  MDOUDOU = 'MDOUDOU',
  JSACTION = 'JSACTION',
}

export interface FieldEntityInformation {
  entityName?: string
  expectedType?: AutocompleteDataType
  entityType?: ENTITY_TYPE
  entityId?: string
  propertyPath?: string
  blockCompletions?: Array<{ parentPath: string; subPath: string }>
}

export interface DataTree {
  [entityName: string]: DataTreeEntity
}

export interface Hinter {
  showHint: (
    editor: CodeMirror.Editor,
    entityInformation: FieldEntityInformation,
    additionalData?: any,
  ) => boolean
  update?: (data: DataTree) => void
  fireOnFocus?: boolean
}
export type AdditionalDynamicDataTree = Record<
  string,
  Record<string, unknown> | TruthyPrimitiveTypes
>
export type HintHelper = (
  editor: CodeMirror.Editor,
  data: DataTree,
  customDataTree?: AdditionalDynamicDataTree,
) => Hinter

export enum MODIFIER {
  Control,
  Meta,
  Alt,
  Shift,
}
export const isModifierKey = (key: any): key is MODIFIER => {
  return Reflect.has(MODIFIER, key)
}

export enum AUTOCOMPLETE_CLOSE_KEY {
  Enter,
  Tab,
  Escape,
  Comma,
  Semicolon,
  // Space,
  Delete,
  'Ctrl+Backspace',
  OSLeft,
  '(',
  ')',
}

export const isCloseKey = (key: any): key is AUTOCOMPLETE_CLOSE_KEY => {
  return Reflect.has(AUTOCOMPLETE_CLOSE_KEY, key)
}
